import OpenAI from "openai";
import dotenv from "dotenv";
import { generatePrompts } from "./prompts.js";
import { analyzeResponse } from "./analyse.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function runAIVisibility(category, brands) {
  const prompts = generatePrompts(category);
  
  const promptPromises = prompts.map(async (prompt) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });
      return { 
        prompt, 
        text: completion.choices[0].message.content, 
        success: true 
      };
    } catch (error) {
      console.error(`Error fetching prompt "${prompt}":`, error);
      return { prompt, text: "", success: false };
    }
  });

  const completions = await Promise.all(promptPromises);
  const successfulCompletions = completions.filter(c => c.success);

  const brandStats = {};
  const sourceStats = {};

  brands.forEach(b => {
    brandStats[b] = { mentions: 0 };
  });

  const results = successfulCompletions.map(({ prompt, text }) => {
    brands.forEach(brand => {
      const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
      const regex = new RegExp(`\\b${escapedBrand}\\b`, 'gi');
      
      if (regex.test(text)) {
        brandStats[brand].mentions += 1;
      }
    });

    const urls = text.match(/https?:\/\/[^\s)]+/g) || [];
    urls.forEach(url => {
      try {
        const domain = new URL(url).hostname.replace("www.", "");
        sourceStats[domain] = (sourceStats[domain] || 0) + 1;
      } catch {}
    });

    return analyzeResponse(prompt, text, brands);
  });

  const visibility = Object.entries(brandStats).map(([brand, data]) => ({
    brand,
    visibilityPercent: Math.round(
      (data.mentions / (successfulCompletions.length || 1)) * 100
    ),
    mentions: data.mentions
  }));

  const avgVisibility =
    visibility.reduce((s, b) => s + b.visibilityPercent, 0) /
    (visibility.length || 1);

  return {
    promptsTracked: successfulCompletions.length,
    visibility,
    averageVisibility: Math.round(avgVisibility),
    topSources: Object.entries(sourceStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count })),
    results
  };
}