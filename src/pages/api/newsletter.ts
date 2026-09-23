import type { APIRoute } from "astro";
import { Resend } from "resend";
import { jsonResponse, readEmail } from "../../lib/http";
import { subscribeToNewsletter } from "../../lib/resendNewsletter";

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const wantsJson = request.headers
    .get("content-type")
    ?.includes("application/json");
  const respond = (body: { ok?: boolean; message: string }, status = 200) => {
    if (wantsJson) return jsonResponse(body, status);
    const state = body.ok
      ? "success"
      : status === 400
        ? "invalid"
        : "unavailable";
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/newsletter?status=${state}`,
        "Cache-Control": "no-store",
      },
    });
  };

  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) {
    return jsonResponse(
      { message: "Please subscribe from this website." },
      403,
    );
  }

  const email = await readEmail(request);
  if (!email)
    return respond({ message: "Please enter a valid email address." }, 400);

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return respond(
      {
        message:
          "Newsletter signup is temporarily unavailable. Please try again later.",
      },
      503,
    );
  }

  try {
    const result = await subscribeToNewsletter(
      new Resend(apiKey),
      email,
      import.meta.env.RESEND_NEWSLETTER_EVENT_NAME,
    );
    return respond(result, result.ok ? 200 : 503);
  } catch {
    return respond(
      {
        message:
          "Newsletter signup is temporarily unavailable. Please try again.",
      },
      503,
    );
  }
};
