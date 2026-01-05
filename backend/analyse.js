export function analyzeResponse(prompt, text, brands) {
  const mentions = brands.map((brand) => ({
    brand,
    mentioned: text.toLowerCase().includes(brand.toLowerCase())
  }));

  return {
    prompt,
    text,
    mentions
  };
}
