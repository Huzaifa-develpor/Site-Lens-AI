import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeWebsiteWithGemini(scrapedData) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
  You are an expert Senior Web Auditor specializing in SEO, UX, Accessibility, Content, and Conversion Optimization.
  Analyze the following scraped website data and return a JSON object with scores and critical issues.

  Target Metadata:
  Title: ${scrapedData.title}
  Description: ${scrapedData.description}
  Page Content Snippet: ${scrapedData.content}

  IMPORTANT — Number of issues:
  Do NOT return a fixed number of issues. Identify every genuine, distinct problem you can find
  across SEO, UX, Accessibility, Content, and Conversion. A simple, well-optimized page may only
  have 2-3 real issues; a poorly built page may have 8-10 or more. Base the count entirely on what
  you actually observe in the scraped data — never pad the list to reach a round number, and never
  artificially cap it. Do not include an issue unless it is clearly supported by the scraped content.

  Required JSON Response Format:
  {
    "scores": {
      "overall": number (0-100),
      "seo": number (0-100),
      "ux": number (0-100),
      "accessibility": number (0-100),
      "content": number (0-100),
      "conversion": number (0-100)
    },
    "issues": [
      {
        "id": "issue-1",
        "category": "SEO" | "UX" | "ACCESSIBILITY" | "CONTENT" | "CONVERSION",
        "title": "Short descriptive title",
        "severity": "high" | "medium" | "low",
        "problem": "Clear explanation of what is currently wrong.",
        "whyItMatters": "Business/SEO impact statement.",
        "howToFix": "Step-by-step resolution strategy.",
        "recommendation": "Best practice guidance.",
        "codeExample": "Optional code snippet (HTML/CSS/JS/Meta tag) or null"
      }
      // ^ this is ONE example item showing the shape — the actual array
      // should contain as many (or as few) items as genuinely apply.
    ]
  }
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  return JSON.parse(responseText);
}