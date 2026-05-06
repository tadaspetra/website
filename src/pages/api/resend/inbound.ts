import type { APIRoute } from "astro";
import { Buffer } from "node:buffer";
import { Resend } from "resend";
import type { Attachment, AttachmentData } from "resend";

export const prerender = false;

const forwardTo = "tadas@tadaspetra.com";
const defaultForwardFrom = "Tadas Petra <forward@letter.tadaspetra.com>";

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const webhookSecret = import.meta.env.RESEND_WEBHOOK_SECRET;
  const forwardFrom = import.meta.env.RESEND_FORWARD_FROM || defaultForwardFrom;

  if (!apiKey || !webhookSecret) {
    return jsonResponse(
      {
        message:
          "Resend inbound forwarding requires RESEND_API_KEY and RESEND_WEBHOOK_SECRET.",
      },
      500,
    );
  }

  const resend = new Resend(apiKey);
  const payload = await request.text();
  const headers = getWebhookHeaders(request);

  if (!headers) {
    return jsonResponse({ message: "Missing Resend webhook headers." }, 400);
  }

  let event;

  try {
    event = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret,
    });
  } catch {
    return jsonResponse({ message: "Invalid Resend webhook signature." }, 400);
  }

  if (event.type !== "email.received") {
    return jsonResponse({ ok: true, ignored: true });
  }

  const emailId = event.data.email_id;
  const emailResponse = await resend.emails.receiving.get(emailId);

  if (emailResponse.error) {
    return jsonResponse(
      {
        message: `Failed to retrieve received email: ${emailResponse.error.message}`,
      },
      emailResponse.error.statusCode || 500,
    );
  }

  const email = emailResponse.data;
  const attachmentsResponse = await resend.emails.receiving.attachments.list({
    emailId,
  });

  if (attachmentsResponse.error) {
    return jsonResponse(
      {
        message: `Failed to retrieve received email attachments: ${attachmentsResponse.error.message}`,
      },
      attachmentsResponse.error.statusCode || 500,
    );
  }

  let attachments: Attachment[];

  try {
    attachments = await downloadAttachments(attachmentsResponse.data.data);
  } catch (error) {
    return jsonResponse(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to download received email attachments.",
      },
      500,
    );
  }

  const subject = email.subject || event.data.subject || "(no subject)";
  const messageId = cleanHeaderValue(email.message_id || event.data.message_id);
  const references = buildReferencesHeader(email.headers, messageId);
  const text = email.text || (!email.html ? "(No email body was included.)" : undefined);
  const sendResponse = await resend.emails.send(
    {
      from: forwardFrom,
      to: forwardTo,
      subject,
      replyTo: email.reply_to?.length ? email.reply_to : email.from,
      html: email.html || undefined,
      text,
      attachments: attachments.length ? attachments : undefined,
      headers: {
        "In-Reply-To": messageId,
        References: references,
      },
    },
    {
      idempotencyKey: `inbound-forward-v2-${emailId}`,
    },
  );

  if (sendResponse.error) {
    return jsonResponse(
      {
        message: `Failed to forward received email: ${sendResponse.error.message}`,
      },
      sendResponse.error.statusCode || 500,
    );
  }

  return jsonResponse({ ok: true, id: sendResponse.data.id });
};

function getWebhookHeaders(request: Request) {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return null;
  }

  return { id, timestamp, signature };
}

async function downloadAttachments(
  attachments: AttachmentData[],
): Promise<Attachment[]> {
  return Promise.all(
    attachments.map(async (attachment) => {
      const response = await fetch(attachment.download_url);

      if (!response.ok) {
        throw new Error(`Failed to download attachment ${attachment.id}.`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      return {
        filename: attachment.filename || undefined,
        content: buffer.toString("base64"),
        contentType: attachment.content_type,
        contentId: attachment.content_id || undefined,
      };
    }),
  );
}

function buildReferencesHeader(
  headers: Record<string, string> | null,
  messageId: string,
) {
  const previousReferences = headers?.references || headers?.References;

  if (!previousReferences) {
    return messageId;
  }

  return cleanHeaderValue(`${previousReferences} ${messageId}`);
}

function cleanHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
