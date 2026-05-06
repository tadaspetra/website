import type { APIRoute } from "astro";
import {
  addNewsletterContact,
  emailPattern,
  sendNewsletterEvent,
} from "../../lib/resendNewsletter";

export const prerender = false;

const defaultNewsletterSignupEvent = "newsletter.signup";

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

  const resendResponse = await addNewsletterContact(apiKey, email);

  if (resendResponse.alreadySubscribed) {
    return jsonResponse({ ok: true });
  }

  if (resendResponse.created) {
    const eventResponse = await sendNewsletterEvent(
      apiKey,
      newsletterSignupEvent,
      email,
      {
        source: "website",
        path: url.pathname,
      },
    );

    if (eventResponse.ok) {
      return jsonResponse({ ok: true });
    }

    return jsonResponse(
      {
        message:
          eventResponse.body?.message ||
          "Newsletter signup was saved, but the welcome email could not start. Please try again.",
      },
      eventResponse.status,
    );
  }

  if (resendResponse.ok) {
    return jsonResponse({ ok: true });
  }

  return jsonResponse(
    {
      message:
        resendResponse.body?.message ||
        "Newsletter signup is temporarily unavailable. Please try again.",
    },
    resendResponse.status,
  );
};

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
