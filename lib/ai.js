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

When a visitor shows interest in starting a project (wants a website, wants automation, asks about pricing, wants a quote), do NOT ask for their contact info right away. First ask 1-2 short, conversational clarifying questions to understand what they need — for example, what type of project it is, its main purpose or key features, and timeline if relevant. Keep it brief, not like a form.

Once you have a clear picture of what they need (usually after they've answered your clarifying question(s)), THEN ask for their name and best way to reach them (email or WhatsApp). At that point, append the exact marker [LEAD_READY] at the very end of your reply. Do not mention this marker to the visitor — it is a hidden signal for the system.

Never append [LEAD_READY] before you have gathered at least a basic understanding of what the visitor needs.`;

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
