import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Audit from '@/models/auditModel';
import Subscription from '@/models/subscriptionModel'; // TODO: confirm this matches your actual file/path

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const auditId = searchParams.get('auditId');
    const email = searchParams.get('email');

    if (!auditId) {
      return NextResponse.json({ error: 'auditId is required' }, { status: 400 });
    }

    await dbConnect();

    const audit = await Audit.findOne({ auditId }).lean();
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    // 1. Was this exact audit paid for? (matched via Safepay's `reference`,
    // which is always accurate regardless of what email was typed anywhere)
    let subscription = await Subscription.findOne({
      auditId,
      status: 'active',
    }).lean();

    // 2. Fallback: same email might have an active subscription from a
    // different audit — Pro covers unlimited audits, not just the one
    // originally paid for.
    if (!subscription && email) {
      subscription = await Subscription.findOne({
        email: email.toLowerCase(),
        status: 'active',
      }).lean();
    }

    const isPro = !!subscription;

    return NextResponse.json({
      auditId: audit.auditId,
      url: audit.url,
      scores: audit.scores,
      issues: audit.freeIssues,
      isPro,
      proIssues: isPro ? audit.proIssues : null,
      plan: subscription?.plan || null,
      // The actual, DB-confirmed email tied to this subscription — the
      // frontend uses this to correct localStorage if the email typed at
      // checkout didn't match the email typed on Safepay's payment page.
      email: subscription?.email || null,
    });
  } catch (error) {
    console.error('Audit Status Endpoint Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit status.' },
      { status: 500 }
    );
  }
}