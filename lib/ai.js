import { getBusinessName, getKnowledgeBaseText } from "@/lib/knowledgeBase";

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-3.6-flash";

/**
 * Maps our chat roles to Gemini's expected role names (user / model).
 */
function toGeminiRole(role) {
  return role === "assistant" ? "model" : "user";
}

/**
 * Calls the Google Gemini API and returns the assistant's reply text.
 * Injects the business knowledge base into the system prompt automatically.
 */
export async function getAIResponse(userMessage, conversationHistory = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const businessName = getBusinessName();
  const knowledgeBaseText = getKnowledgeBaseText();

  const systemPrompt = `You are a helpful assistant for ${businessName}. Answer only using this information:

${knowledgeBaseText}

If you don't know the answer, say you'll have someone follow up.

When you detect buying intent (the visitor wants a quote, wants to book, asks about pricing, or is ready to move forward), append the exact marker [LEAD_READY] at the very end of your reply. Do not mention this marker to the visitor — it is a hidden signal for the system.`;

  // Gemini expects alternating user/model turns in the contents array.
  const contents = [
    ...conversationHistory.map((entry) => ({
      role: toGeminiRole(entry.role),
      parts: [{ text: entry.content }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const url = `${GEMINI_API_BASE}/${MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error("Gemini API returned an empty response");
  }

  return reply;
}
