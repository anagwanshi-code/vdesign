type GenerateServiceDescriptionInput = {
  title: string;
};

/**
 * Mock AI copywriter for service cards — swap with OpenAI / Anthropic when configured.
 */
export async function generateServiceDescription(
  input: GenerateServiceDescriptionInput,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return `${input.title} is delivered with editorial rigor and studio-controlled craft—tailored for luxury brands that expect cinematic presentation, precise production, and measurable impact across packaging, commerce, and creative campaigns.`;
}
