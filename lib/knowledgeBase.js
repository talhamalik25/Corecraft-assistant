import clientConfig from "@/data/clientConfig";

const { business, services, faqs } = clientConfig;

/**
 * Formats the unified clientConfig as plain text for the AI system prompt.
 */
export function getKnowledgeBaseText() {
  const servicesList = services.map((service) => `- ${service}`).join("\n");

  const faqList = faqs
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join("\n\n");

  return [
    `Business Name: ${business.name}`,
    `Phone: ${business.phone}`,
    `Address: ${business.address}`,
    "",
    "Services:",
    servicesList,
    "",
    `Hours: ${business.hours}`,
    "",
    "FAQs:",
    faqList,
  ].join("\n");
}

/**
 * Returns the business name from the unified client config.
 */
export function getBusinessName() {
  return business.shortName || business.name;
}
