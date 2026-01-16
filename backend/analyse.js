import { detectBrand } from "./utils/brandMatch.js";

export function analyzeResponse(prompt, text, brands) {
  return {
    prompt,
    text,
    mentions: brands.map(brand => ({
      brand,
      mentioned: detectBrand(text, brand)
    }))
  };
}
