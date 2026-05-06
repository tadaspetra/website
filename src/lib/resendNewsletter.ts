import { createHash } from "node:crypto";
import { Resend } from "resend";
import type { ErrorResponse, SendEventResponseSuccess } from "resend";

const resendAudienceId = "74cfa5dc-561e-42dc-8c9b-8732a9a6876e";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResendResponseBody = {
  message?: string;
};

export async function addNewsletterContact(apiKey: string, email: string) {
  const resend = new Resend(apiKey);
  const existingContact = await getNewsletterContactStatus(resend, email);

  if (existingContact.ok && existingContact.exists) {
    return {
      ok: true,
      status: existingContact.status,
      body: existingContact.body,
      alreadySubscribed: true,
      created: false,
    };
  }

  const resendResponse = await resend.contacts.create({
    audienceId: resendAudienceId,
    email,
    unsubscribed: false,
  });

  const body = getResponseBody(resendResponse.error);
  const status = getResponseStatus(resendResponse.error);
  const alreadySubscribed = isAlreadySubscribed(status, body);

  return {
    ok: !resendResponse.error || alreadySubscribed,
    status,
    body,
    alreadySubscribed,
    created: !resendResponse.error,
  };
}

export async function sendNewsletterEvent(
  apiKey: string,
  event: string,
  email: string,
  payload: Record<string, unknown>,
) {
  const resend = new Resend(apiKey);
  const eventResponse = await resend.post<SendEventResponseSuccess>(
    "/events/send",
    {
      event,
      email,
      payload,
    },
    {
      idempotencyKey: getNewsletterIdempotencyKey("event", event, email),
    },
  );

  const body = getResponseBody(eventResponse.error);

  return {
    ok: !eventResponse.error,
    status: getResponseStatus(eventResponse.error),
    body,
  };
}

function getResponseBody(error: ErrorResponse | null): ResendResponseBody | null {
  return error ? { message: error.message } : null;
}

function getResponseStatus(error: ErrorResponse | null) {
  return error ? error.statusCode || 500 : 200;
}

function isAlreadySubscribed(status: number, body: ResendResponseBody | null) {
  return (
    status === 409 || String(body?.message || "").toLowerCase().includes("already")
  );
}

async function getNewsletterContactStatus(resend: Resend, email: string) {
  const contactResponse = await resend.get<unknown>(
    `/audiences/${encodeURIComponent(resendAudienceId)}/contacts/${encodeURIComponent(email)}`,
  );
  const body = getResponseBody(contactResponse.error);
  const status = getResponseStatus(contactResponse.error);
  const notFound = isContactNotFound(status, body);

  return {
    ok: !contactResponse.error || notFound,
    status,
    body,
    exists: !contactResponse.error && Boolean(contactResponse.data),
  };
}

function isContactNotFound(status: number, body: ResendResponseBody | null) {
  return (
    status === 404 ||
    String(body?.message || "")
      .toLowerCase()
      .includes("not found")
  );
}

function getNewsletterIdempotencyKey(kind: "event", ...parts: string[]) {
  const digest = createHash("sha256").update(parts.join("\0")).digest("hex");

  return `newsletter-${kind}-v1-${digest}`;
}
