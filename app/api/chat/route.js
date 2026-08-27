import { getAIResponse } from "@/lib/ai";

/**
 * POST /api/chat — accepts a visitor message + history, returns an AI reply.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "A message string is required" },
        { status: 400 }
      );
    }

    const reply = await getAIResponse(message, history);

    return Response.json({ reply });
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to generate a response" },
      { status: 500 }
    );
  }
}
