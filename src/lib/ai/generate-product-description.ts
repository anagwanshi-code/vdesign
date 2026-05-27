type GenerateProductDescriptionInput = {
  title: string;
  subtitle?: string;
};

/**
 * Mock AI copywriter — swap with OpenAI / Anthropic when API keys are configured.
 */
export async function generateProductDescription(
  input: GenerateProductDescriptionInput,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const subtitleLine = input.subtitle
    ? `${input.subtitle} — `
    : "";

  return `${subtitleLine}${input.title} is composed for discerning collectors and design-led spaces. Archival-grade materials, calibrated finishes, and studio-controlled production ensure each piece reads with quiet luxury—equally at home in boutique retail, hospitality suites, and private residences. Curated by V Design Luxury with native INR settlement and white-glove fulfillment across India.`;
}
