import type { APIRoute } from "astro";

const resendAudienceId = "74cfa5dc-561e-42dc-8c9b-8732a9a6876e";
const resendApiUrl = `https://api.resend.com/audiences/${resendAudienceId}/contacts`;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;

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
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
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

  if (resendResponse.ok || alreadySubscribed) {
    return jsonResponse({ ok: true });
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
