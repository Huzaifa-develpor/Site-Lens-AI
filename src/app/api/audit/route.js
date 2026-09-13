import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { scrapeWebsite } from '@/lib/firecrawl';
import { analyzeWebsiteWithGemini } from '@/lib/gemini';
import { dbConnect } from '@/lib/mongodb';
import Audit from '@/models/auditModel';

export async function POST(req) {
  try {
    const { url, forceRefresh } = await req.json();

    // 1. URL Validation & Sanitization
    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (_) {
      return NextResponse.json({ error: 'Please enter a valid public website URL.' }, { status: 400 });
    }

    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(parsedUrl.hostname) || parsedUrl.hostname.endsWith('.local')) {
      return NextResponse.json({ error: 'Private or internal URLs are not allowed.' }, { status: 400 });
    }

    const cleanUrl = parsedUrl.toString();

    await dbConnect();

    // 2. Cache check — if this exact URL was already audited within the
    // last 24h (the TTL window on the Audit model), reuse that result
    // instead of burning another Gemini call. "Re-run Audit" passes
    // forceRefresh: true to skip this and get a fresh analysis.
    if (!forceRefresh) {
      const existing = await Audit.findOne({ url: cleanUrl }).sort({ createdAt: -1 }).lean();
      if (existing) {
        return NextResponse.json({
          auditId: existing.auditId,
          url: existing.url,
          scores: existing.scores,
          issues: existing.freeIssues,
          cached: true,
        });
      }
    }

    // 3. Scrape Website Content
    const scrapedData = await scrapeWebsite(cleanUrl);

    // 4. AI Analysis
    const aiResult = await analyzeWebsiteWithGemini(scrapedData);

    // 5. Split Payload into Free vs Pro Sections
    const auditId = `AUDIT-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    const freeIssues = aiResult.issues.map(issue => ({
      id: issue.id,
      category: issue.category,
      title: issue.title,
      severity: issue.severity,
      problem: issue.problem
    }));

    const proIssues = aiResult.issues.map(issue => ({
      id: issue.id,
      whyItMatters: issue.whyItMatters,
      howToFix: issue.howToFix,
      recommendation: issue.recommendation,
      codeExample: issue.codeExample
    }));

    // 6. Store in Database (upsert on url so a forced re-run replaces the
    // old cached entry instead of piling up duplicates for the same URL)
    await Audit.findOneAndDelete({ url: cleanUrl });
    await Audit.create({
      auditId,
      url: cleanUrl,
      scores: aiResult.scores,
      freeIssues,
      proIssues
    });

    // 7. Return Free Payload & Token
    return NextResponse.json({
      auditId,
      url: cleanUrl,
      scores: aiResult.scores,
      issues: freeIssues
    });

  } catch (error) {
    console.error('Audit Endpoint Error:', error);

    const message = (error?.message || '').toLowerCase();

    if (message.includes('googlegenerativeai') || message.includes('503') || message.includes('high demand') || message.includes('overloaded')) {
      return NextResponse.json(
        {
          errorCode: 'AI_BUSY',
          error: 'Our AI service is currently busy. Please try again in a moment.',
        },
        { status: 503 }
      );
    }

    if (
      message.includes('blocked') ||
      message.includes('403') ||
      message.includes('forbidden') ||
      message.includes('bot') ||
      message.includes('captcha') ||
      message.includes('robots')
    ) {
      return NextResponse.json(
        {
          errorCode: 'SITE_BLOCKED',
          error: "We couldn't access this website — it may be blocking automated tools. Please try a different URL.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        errorCode: 'UNKNOWN',
        error: 'Failed to complete website audit. Please try again.',
      },
      { status: 500 }
    );
  }
}