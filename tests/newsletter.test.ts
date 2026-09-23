import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { Resend } from "resend";
import { subscribeToNewsletter } from "../src/lib/resendNewsletter";
import { normalizeEmail, readEmail, readLimitedText } from "../src/lib/http";

const email = "reader@example.com";
const contact = (overrides = {}) => ({
  id: "contact-id",
  email,
  unsubscribed: false,
  created_at: "2020-01-01T00:00:00Z",
  ...overrides,
});

test("normalizes addresses and rejects malformed JSON shapes without throwing", async () => {
  assert.equal(normalizeEmail("  READER@example.com "), email);
  for (const value of [
    null,
    {},
    [],
    123,
    "",
    "a@b",
    "a b@example.com",
    "a".repeat(255) + "@example.com",
  ]) {
    assert.equal(normalizeEmail(value), null);
  }
  for (const body of [
    "null",
    "[]",
    "1",
    '{"email":42}',
    '{"email":{}}',
    "{broken",
  ]) {
    assert.equal(
      await readEmail(
        new Request("https://example.com", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
        }),
      ),
      null,
    );
  }
  assert.equal(
    await readEmail(
      new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({ email: " READER@example.com " }),
      }),
    ),
    email,
  );
});

test("limits streamed bodies even without a Content-Length header", async () => {
  const request = new Request("https://example.com", {
    method: "POST",
    body: "x".repeat(4097),
  });
  await assert.rejects(readLimitedText(request, 4096), /too large/);
});

function mockResend(
  t: TestContext,
  responses: { status?: number; body: unknown }[],
) {
  const calls: {
    url: string;
    method?: string;
    body: any;
    key: string | null;
  }[] = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (input: string, init?: RequestInit) => {
      calls.push({
        url: String(input),
        method: init?.method,
        body: init?.body ? JSON.parse(String(init.body)) : null,
        key: new Headers(init?.headers).get("idempotency-key"),
      });
      const response = responses.shift();
      assert.ok(response, "Unexpected network request");
      return Response.json(response.body, { status: response.status ?? 200 });
    },
  );
  return { resend: new Resend("test-key"), calls };
}

const notFound = {
  status: 404,
  body: { statusCode: 404, name: "not_found", message: "Contact not found" },
};
const unavailable = {
  status: 503,
  body: { statusCode: 503, name: "application_error", message: "Unavailable" },
};

test("creates a contact before firing an idempotent welcome event", async (t) => {
  const { resend, calls } = mockResend(t, [
    notFound,
    { body: { id: "new" } },
    { body: { id: "event" } },
  ]);
  assert.equal((await subscribeToNewsletter(resend, email)).ok, true);
  assert.equal(calls.length, 3);
  assert.equal(calls[1].body.email, email);
  assert.match(calls[2].key!, /^newsletter-event-v1-[a-f0-9]{64}$/);
  assert.ok(!calls[2].key!.includes(email));
});

test("does not mutate contacts when lookup fails", async (t) => {
  const { resend, calls } = mockResend(t, [unavailable]);
  await assert.rejects(subscribeToNewsletter(resend, email), /lookup failed/);
  assert.equal(calls.length, 1);
});

test("an existing subscriber does not restart an old automation", async (t) => {
  const { resend, calls } = mockResend(t, [{ body: contact() }]);
  const result = await subscribeToNewsletter(resend, email);
  assert.equal(result.ok, true);
  assert.equal(result.alreadySubscribed, true);
  assert.equal(calls.length, 1);
});

test("explicit signup restores an unsubscribed contact", async (t) => {
  const { resend, calls } = mockResend(t, [
    { body: contact({ unsubscribed: true }) },
    { body: { id: "contact-id" } },
  ]);
  const result = await subscribeToNewsletter(resend, email);
  assert.equal(result.ok, true);
  assert.equal(result.alreadySubscribed, false);
  assert.equal(calls[1].method, "PATCH");
  assert.equal(calls[1].body.unsubscribed, false);
});

test("retry after a welcome failure uses exactly the same payload and key", async (t) => {
  const { resend, calls } = mockResend(t, [
    notFound,
    { body: { id: "new" } },
    unavailable,
    { body: contact({ created_at: new Date().toISOString() }) },
    { body: { id: "event" } },
  ]);
  assert.equal((await subscribeToNewsletter(resend, email)).ok, false);
  assert.equal((await subscribeToNewsletter(resend, email)).ok, true);
  assert.deepEqual(calls[2].body, calls[4].body);
  assert.equal(calls[2].key, calls[4].key);
});

test("a generic conflict is not reported as a successful subscription", async (t) => {
  const { resend } = mockResend(t, [
    notFound,
    {
      status: 409,
      body: {
        name: "conflict",
        message: "Already processing another operation",
      },
    },
  ]);
  await assert.rejects(subscribeToNewsletter(resend, email), /creation failed/);
});
