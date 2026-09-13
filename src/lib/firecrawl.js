import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || '',
});

export async function scrapeWebsite(url) {
  try {
    const scrapeResult = await app.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
    });

    // Fix: Check if markdown or html exists instead of checking scrapeResult.success
    if (!scrapeResult || (!scrapeResult.markdown && !scrapeResult.html)) {
      console.error('Firecrawl Empty Response:', scrapeResult);
      throw new Error(scrapeResult?.error || 'Failed to fetch website contents.');
    }

    return {
      title: scrapeResult.metadata?.title || '',
      description: scrapeResult.metadata?.description || '',
      content: scrapeResult.markdown?.substring(0, 8000) || '',
      statusCode: scrapeResult.metadata?.statusCode || 200,
    };
  } catch (error) {
    console.error('Firecrawl Scrape Detailed Error:', error.message || error);
    throw new Error(error.message || 'Could not access or read target website.');
  }
}