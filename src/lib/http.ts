export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : null;
}

/** Bound memory even for a chunked request without Content-Length. */
export async function readLimitedText(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit)
    throw new Error("Request too large");
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let length = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new Error("Request too large");
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export async function readEmail(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  try {
    const text = await readLimitedText(request, 4096);
    if (contentType.includes("application/json")) {
      const body: unknown = JSON.parse(text);
      return normalizeEmail(
        body && typeof body === "object" && "email" in body ? body.email : null,
      );
    }
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return normalizeEmail(new URLSearchParams(text).get("email"));
    }
    return null;
  } catch {
    return null;
  }
}
