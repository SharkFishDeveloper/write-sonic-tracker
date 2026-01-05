import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generatePrompts(category) {
  const systemPrompt = `
You are an expert in AI search visibility and brand tracking.
Generate realistic user questions people would ask an AI
when researching ${category}.

Rules:
- Questions must naturally cause brand mentions
- Questions must ask for tools, comparisons, or recommendations
- Each question MUST request a website or review link
- Return ONLY a JSON array of strings
- Generate exactly 5 prompts
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate AI visibility prompts for category: ${category}`
      }
    ],
    temperature: 0.7
  });

  return JSON.parse(response.choices[0].message.content);
}
