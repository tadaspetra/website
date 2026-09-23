import assert from "node:assert/strict";
import { test } from "node:test";
import { Resend } from "resend";
import { forwardReceivedEmail } from "../src/lib/inboundEmail";

const options = {
  emailId: "received-123",
  fallbackSubject: "Fallback",
  fallbackMessageId: "<original>",
  forwardFrom: "forward@example.com",
  forwardTo: "owner@example.com",
};
const received = {
  from: "sender@example.com",
  reply_to: ["reply@example.com"],
  text: "Hello",
  html: null,
  subject: "Question",
  message_id: "<original>\r\n",
  headers: { references: "<earlier>\r\n" },
};
const attachment = (id: string) => ({
  id,
  filename: `${id}.txt`,
  size: 4,
  content_type: "text/plain",
  content_id: id,
  download_url: `https://attachments.example.com/${id}`,
});

test("forwards every attachment page with preserved threading and an idempotency key", async (t) => {
  const calls: { url: string; body: any; key: string | null }[] = [];
  const replies = [
    Response.json(received),
    Response.json({ has_more: true, data: [attachment("one")] }),
    Response.json({ has_more: false, data: [attachment("two")] }),
    new Response("one"),
    new Response("two"),
    Response.json({ id: "sent-123" }),
  ];
  t.mock.method(
    globalThis,
    "fetch",
    async (url: string, init?: RequestInit) => {
      calls.push({
        url: String(url),
        body: init?.body ? JSON.parse(String(init.body)) : null,
        key: new Headers(init?.headers).get("idempotency-key"),
      });
      assert.ok(replies.length, "Unexpected network request");
      return replies.shift()!;
    },
  );
  const response = await forwardReceivedEmail(new Resend("test-key"), options);
  assert.equal(response.status, 200);
  assert.match(calls[2].url, /after=one/);
  const sent = calls.at(-1)!;
  assert.equal(sent.key, "inbound-forward-v2-received-123");
  assert.equal(sent.body.reply_to[0], "reply@example.com");
  assert.deepEqual(sent.body.headers, {
    "In-Reply-To": "<original>",
    References: "<earlier> <original>",
  });
  assert.deepEqual(
    sent.body.attachments.map((a: any) => a.filename),
    ["one.txt", "two.txt"],
  );
  assert.equal(
    sent.body.attachments[0].content,
    Buffer.from("one").toString("base64"),
  );
});

test("never sends a partial forward when an attachment cannot be downloaded", async (t) => {
  let calls = 0;
  const replies = [
    Response.json(received),
    Response.json({ has_more: false, data: [attachment("one")] }),
    new Response("Unavailable", { status: 503 }),
  ];
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    assert.ok(replies.length);
    return replies.shift()!;
  });
  await assert.rejects(
    forwardReceivedEmail(new Resend("test-key"), options),
    /download failed/,
  );
  assert.equal(calls, 3);
});

test("rejects stalled attachment pagination instead of looping", async (t) => {
  const replies = [
    Response.json(received),
    Response.json({ has_more: true, data: [] }),
  ];
  t.mock.method(globalThis, "fetch", async () => {
    assert.ok(replies.length);
    return replies.shift()!;
  });
  await assert.rejects(
    forwardReceivedEmail(new Resend("test-key"), options),
    /pagination/,
  );
});
