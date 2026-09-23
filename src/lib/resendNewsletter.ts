import { createHash } from "node:crypto";
import { Resend } from "resend";

const audienceId = "74cfa5dc-561e-42dc-8c9b-8732a9a6876e";
const retryWindowMs = 24 * 60 * 60 * 1000;

export interface SignupResult {
  ok: boolean;
  message: string;
  alreadySubscribed?: boolean;
}

// One service is shared by enhanced and plain HTML form submissions.
export async function subscribeToNewsletter(
  resend: Resend,
  email: string,
  event = "newsletter.signup",
): Promise<SignupResult> {
  const existing = await resend.contacts.get({ audienceId, email });
  if (existing.error && existing.error.statusCode !== 404) {
    throw new Error("Contact lookup failed");
  }

  const alreadySubscribed = Boolean(
    existing.data && !existing.data.unsubscribed,
  );
  if (existing.data?.unsubscribed) {
    const updated = await resend.contacts.update({
      audienceId,
      email,
      unsubscribed: false,
    });
    if (updated.error) throw new Error("Contact update failed");
  } else if (!existing.data) {
    const created = await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });
    // Do not interpret a generic conflict as proof of a subscription.
    if (created.error) throw new Error("Contact creation failed");
  }

  // Retry a failed welcome event for a recently created contact, using the
  // same payload and key. Older subscribers must not restart the automation.
  const createdAt = existing.data
    ? Date.parse(existing.data.created_at)
    : Date.now();
  const age = Date.now() - createdAt;
  if (age >= 0 && age < retryWindowMs) {
    const digest = createHash("sha256")
      .update([event, email].join("\0"))
      .digest("hex");
    const sent = await resend.post(
      "/events/send",
      {
        event,
        email,
        payload: { source: "website", path: "/api/newsletter" },
      },
      { idempotencyKey: `newsletter-event-v1-${digest}` },
    );
    if (sent.error) {
      return {
        ok: false,
        message:
          "Your signup is saved, but the welcome email could not start. Please try again.",
      };
    }
  }

  return {
    ok: true,
    alreadySubscribed,
    message: alreadySubscribed
      ? "You're already signed up. If you don't see the welcome email, check your spam folder."
      : "You're on the list. Thank you.",
  };
}
