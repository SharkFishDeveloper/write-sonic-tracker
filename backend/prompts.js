import { openai } from "./openaiClient.js";

export async function generatePrompts(category) {
  const systemPrompt = `
Generate exactly 5 realistic user questions for AI search.
Each question must ask for links or reviews.
Return ONLY a JSON array of strings.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Category: ${category}` }
    ],
    temperature: 0.7
  });

  return parseJsonSafely(response.choices[0].message.content);
}

function parseJsonSafely(text) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error("Expected array");
    }

    return parsed;
  } catch (err) {
    console.error("Prompt parsing failed:", err);
    throw new Error("Bad prompt format from OpenAI");
  }
}
