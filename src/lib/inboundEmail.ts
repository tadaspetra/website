import { Buffer } from "node:buffer";
import type { Resend, Attachment, AttachmentData } from "resend";
import { jsonResponse } from "./http";

interface ForwardOptions {
  emailId: string;
  fallbackSubject: string;
  fallbackMessageId: string;
  forwardFrom: string;
  forwardTo: string;
}

export async function forwardReceivedEmail(
  resend: Resend,
  {
    emailId,
    fallbackSubject,
    fallbackMessageId,
    forwardFrom,
    forwardTo,
  }: ForwardOptions,
) {
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
  const metadata: AttachmentData[] = [];
  let after: string | undefined;
  do {
    const response = await resend.emails.receiving.attachments.list({
      emailId,
      after,
      limit: 100,
    });
    if (response.error) throw new Error("Attachment lookup failed");
    metadata.push(...response.data.data);
    const next = response.data.data.at(-1)?.id;
    if (response.data.has_more && (!next || next === after)) {
      throw new Error("Invalid attachment pagination");
    }
    after = response.data.has_more ? next : undefined;
  } while (after);
  const attachments = await downloadAttachments(metadata);

  const subject = email.subject || fallbackSubject || "(no subject)";
  const messageId = cleanHeaderValue(email.message_id || fallbackMessageId);
  const references = buildReferencesHeader(email.headers, messageId);
  const body = email.html
    ? { html: email.html, text: email.text || undefined }
    : { text: email.text || "(No email body was included.)" };
  const sendResponse = await resend.emails.send(
    {
      from: forwardFrom,
      to: forwardTo,
      subject,
      replyTo: email.reply_to?.length ? email.reply_to : email.from,
      ...body,
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
}
async function downloadAttachments(
  metadata: AttachmentData[],
): Promise<Attachment[]> {
  // Download sequentially to bound memory and preserve attachment order.
  const attachments: Attachment[] = [];
  for (const attachment of metadata) {
    const response = await fetch(attachment.download_url, {
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Attachment download failed");
    const buffer = Buffer.from(await response.arrayBuffer());
    attachments.push({
      filename: attachment.filename || undefined,
      content: buffer.toString("base64"),
      contentType: attachment.content_type,
      contentId: attachment.content_id || undefined,
    });
  }
  return attachments;
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
  return value.replace(/[\r\n\t ]+/g, " ").trim();
}
