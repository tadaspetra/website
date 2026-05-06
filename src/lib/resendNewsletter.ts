import { Resend } from "resend";
import type { ErrorResponse } from "resend";

const resendAudienceId = "74cfa5dc-561e-42dc-8c9b-8732a9a6876e";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResendResponseBody = {
  message?: string;
};

export async function addNewsletterContact(apiKey: string, email: string) {
  const resend = new Resend(apiKey);
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
  };
}

export async function sendNewsletterEvent(
  apiKey: string,
  event: string,
  email: string,
  payload: Record<string, unknown>,
) {
  const resend = new Resend(apiKey);
  const eventResponse = await resend.events.send({
    event,
    email,
    payload,
  });

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
  return error?.statusCode || 200;
}

function isAlreadySubscribed(status: number, body: ResendResponseBody | null) {
  return (
    status === 409 || String(body?.message || "").toLowerCase().includes("already")
  );
}
