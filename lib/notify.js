import { Resend } from "resend";

/**
 * Sends an email to the business owner when a new lead is captured.
 * Failures are logged but never thrown — lead saving must not depend on email.
 */
export async function sendLeadNotification(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!apiKey || !ownerEmail) {
    console.warn(
      "Resend credentials missing (RESEND_API_KEY or OWNER_EMAIL) — skipping email notification."
    );
    return;
  }

  const textBody = [
    "New lead captured from your AI chat widget",
    "",
    `Name: ${lead.name}`,
    `Contact: ${lead.contact}`,
    "",
    "Conversation summary:",
    lead.conversationSummary || "(No conversation recorded)",
  ].join("\n");

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 560px; color: #1e293b;">
      <h2 style="margin: 0 0 16px;">New lead captured</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${lead.name}</p>
      <p style="margin: 0 0 16px;"><strong>Contact:</strong> ${lead.contact}</p>
      <p style="margin: 0 0 8px;"><strong>Conversation summary:</strong></p>
      <pre style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; white-space: pre-wrap; font-size: 14px;">${lead.conversationSummary || "(No conversation recorded)"}</pre>
    </div>
  `;

  const payload = {
    // Sandbox restriction: onboarding@resend.dev can only send TO the email
    // address that owns the Resend account. Once you verify a custom domain
    // in the Resend dashboard, switch `from` to an address on that domain.
    from: "onboarding@resend.dev",
    to: ownerEmail,
    subject: `New Lead: ${lead.name}`,
    text: textBody,
    html: htmlBody,
  };

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send(payload);

    if (error) {
      console.error("Resend error:", error);
      return;
    }
  } catch (error) {
    console.error("Email notification failed:", error);
  }
}
