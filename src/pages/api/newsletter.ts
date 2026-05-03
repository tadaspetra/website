import type { APIRoute } from "astro";

const resendAudienceId = "74cfa5dc-561e-42dc-8c9b-8732a9a6876e";
const resendApiUrl = `https://api.resend.com/audiences/${resendAudienceId}/contacts`;
const resendEventsApiUrl = "https://api.resend.com/events/send";
const defaultNewsletterSignupEvent = "newsletter.signup";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const newsletterSignupEvent =
    import.meta.env.RESEND_NEWSLETTER_EVENT_NAME || defaultNewsletterSignupEvent;

  if (!apiKey) {
    return jsonResponse(
      { message: "Newsletter signup is not configured yet." },
      500,
    );
  }

  const body = await readRequestBody(request);
  const email = body.email?.trim().toLowerCase();

  if (!email || !emailPattern.test(email)) {
    return jsonResponse({ message: "Please enter a valid email address." }, 400);
  }

  const resendResponse = await fetch(resendApiUrl, {
    method: "POST",
    headers: createResendHeaders(apiKey),
    body: JSON.stringify({
      email,
      unsubscribed: false,
    }),
  });

  const error = await resendResponse.json().catch(() => null);
  const alreadySubscribed =
    resendResponse.status === 409 ||
    String(error?.message || "")
      .toLowerCase()
      .includes("already");

  if (alreadySubscribed) {
    return jsonResponse({ ok: true });
  }

  if (resendResponse.ok) {
    const eventResponse = await fetch(resendEventsApiUrl, {
      method: "POST",
      headers: createResendHeaders(apiKey),
      body: JSON.stringify({
        event: newsletterSignupEvent,
        email,
        payload: {
          source: "website",
          path: url.pathname,
        },
      }),
    });

    if (eventResponse.ok) {
      return jsonResponse({ ok: true });
    }

    const eventError = await eventResponse.json().catch(() => null);

    return jsonResponse(
      {
        message:
          eventError?.message ||
          "Newsletter signup was saved, but the welcome email could not start. Please try again.",
      },
      eventResponse.status,
    );
  }

  return jsonResponse(
    {
      message:
        error?.message ||
        "Newsletter signup is temporarily unavailable. Please try again.",
    },
    resendResponse.status,
  );
};

function createResendHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "User-Agent": "tadaspetra-website",
  };
}

async function readRequestBody(request: Request): Promise<{ email?: string }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json().catch(() => ({}));
  }

  const formData = await request.formData().catch(() => null);
  const email = formData?.get("email");

  return {
    email: typeof email === "string" ? email : undefined,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
