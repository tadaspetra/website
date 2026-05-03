const resendAudienceId = "74cfa5dc-561e-42dc-8c9b-8732a9a6876e";
const resendApiUrl = `https://api.resend.com/audiences/${resendAudienceId}/contacts`;
const resendEventsApiUrl = "https://api.resend.com/events/send";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResendResponseBody = {
  message?: string;
};

export async function addNewsletterContact(apiKey: string, email: string) {
  const resendResponse = await fetch(resendApiUrl, {
    method: "POST",
    headers: createResendHeaders(apiKey),
    body: JSON.stringify({
      email,
      unsubscribed: false,
    }),
  });

  const body = (await resendResponse.json().catch(() => null)) as
    | ResendResponseBody
    | null;
  const alreadySubscribed = isAlreadySubscribed(resendResponse.status, body);

  return {
    ok: resendResponse.ok || alreadySubscribed,
    status: resendResponse.status,
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
  const eventResponse = await fetch(resendEventsApiUrl, {
    method: "POST",
    headers: createResendHeaders(apiKey),
    body: JSON.stringify({
      event,
      email,
      payload,
    }),
  });

  const body = (await eventResponse.json().catch(() => null)) as
    | ResendResponseBody
    | null;

  return {
    ok: eventResponse.ok,
    status: eventResponse.status,
    body,
  };
}

function createResendHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "User-Agent": "tadaspetra-website",
  };
}

function isAlreadySubscribed(status: number, body: ResendResponseBody | null) {
  return status === 409 || String(body?.message || "").toLowerCase().includes("already");
}
