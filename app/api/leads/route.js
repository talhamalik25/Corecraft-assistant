import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { sendLeadNotification } from "@/lib/notify";
import { isDashboardAuthenticated } from "@/lib/auth";

/**
 * POST /api/leads — saves a new lead and emails the business owner.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, contact, conversationSummary } = body;

    if (!name || !contact) {
      return Response.json(
        { error: "Name and contact are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const lead = await Lead.create({
      name: name.trim(),
      contact: contact.trim(),
      conversationSummary: conversationSummary || "",
    });

    // Email notification — never blocks the response if it fails.
    await sendLeadNotification(lead);

    return Response.json({ success: true, leadId: lead._id });
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to save lead" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads — returns all leads, newest first (dashboard use).
 * Requires a valid dashboard auth cookie.
 */
export async function GET(request) {
  try {
    if (!isDashboardAuthenticated(request)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();

    return Response.json({ leads });
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
