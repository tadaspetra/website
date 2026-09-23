import type { APIRoute } from "astro";
import { jsonResponse, readLimitedText } from "../../../lib/http";
import { Resend } from "resend";
import { forwardReceivedEmail } from "../../../lib/inboundEmail";

export const prerender = false;

const forwardTo = "tadas@tadaspetra.com";
const defaultForwardFrom = "Tadas Petra <forward@letter.tadaspetra.com>";

export const POST: APIRoute = async (context) => {
  try {
    return await forwardInbound(context);
  } catch {
    // A retryable response lets the verified webhook be delivered again.
    return jsonResponse(
      { message: "Email forwarding is temporarily unavailable." },
      503,
    );
  }
};

const forwardInbound: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const webhookSecret = import.meta.env.RESEND_WEBHOOK_SECRET;
  const forwardFrom = import.meta.env.RESEND_FORWARD_FROM || defaultForwardFrom;

  if (!apiKey || !webhookSecret) {
    return jsonResponse(
      {
        message:
          "Resend inbound forwarding requires RESEND_API_KEY and RESEND_WEBHOOK_SECRET.",
      },
      500,
    );
  }

  const resend = new Resend(apiKey);
  const headers = getWebhookHeaders(request);

  if (!headers) {
    return jsonResponse({ message: "Missing Resend webhook headers." }, 400);
  }

  const payload = await readLimitedText(request, 1024 * 1024);
  let event;

  try {
    event = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret,
    });
  } catch {
    return jsonResponse({ message: "Invalid Resend webhook signature." }, 400);
  }

  if (event.type !== "email.received") {
    return jsonResponse({ ok: true, ignored: true });
  }

  return forwardReceivedEmail(resend, {
    emailId: event.data.email_id,
    fallbackSubject: event.data.subject,
    fallbackMessageId: event.data.message_id,
    forwardFrom,
    forwardTo,
  });
};

function getWebhookHeaders(request: Request) {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return null;
  }

  return { id, timestamp, signature };
}
