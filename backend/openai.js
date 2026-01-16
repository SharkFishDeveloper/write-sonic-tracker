import { openai } from "./openaiClient.js";
import { generatePrompts } from "./prompts.js";
import { analyzeResponse } from "./analyse.js";
import { detectBrand } from "./utils/brandMatch.js";

export async function runAIVisibility(category, brands) {
  const prompts = await generatePrompts(category);

  const rawResults = await Promise.all(
    prompts.map(async (prompt) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        });
        return { prompt, text: completion.choices[0].message.content };
      } catch (err) {
        console.error(`Failed prompt: ${prompt}`, err);
        return null;
      }
    })
  );

  const validResults = rawResults.filter(Boolean);

  const brandStats = Object.fromEntries(
    brands.map(b => [b, { mentions: 0 }])
  );
  const sourceStats = {};
  const processedResults = [];

  for (const res of validResults) {
    brands.forEach(brand => {
      if (detectBrand(res.text, brand)) {
        brandStats[brand].mentions++;
      }
    });

    extractSources(res.text, sourceStats);
    processedResults.push(analyzeResponse(res.prompt, res.text, brands));
  }

  return buildSummary(processedResults, brandStats, sourceStats);
}

function extractSources(text, stats) {
  const urls = text.match(/https?:\/\/[^\s)]+/g) || [];
  urls.forEach(url => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      stats[domain] = (stats[domain] || 0) + 1;
    } catch {
      console.warn("Skipping bad URL:", url);
    }
  });
}

function buildSummary(results, brandStats, sourceStats) {
  const total = results.length || 1;

  const visibility = Object.entries(brandStats).map(([brand, data]) => ({
    brand,
    mentions: data.mentions,
    visibilityPercent: Math.round((data.mentions / total) * 100)
  }));

  return {
    promptsTracked: total,
    visibility,
    averageVisibility: Math.round(
      visibility.reduce((s, b) => s + b.visibilityPercent, 0) / visibility.length
    ),
    topSources: Object.entries(sourceStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count })),
    results
  };
}
