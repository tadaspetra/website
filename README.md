# Tadas Petra's website

A personal site built with Astro, Tailwind CSS, and Markdown/MDX. Most routes are
prerendered; newsletter signup and the signed Resend inbound webhook run on Vercel.
React is used only for the interactive computer-science essay demos.

## Development

Use Node 22.12+ (Node 24 recommended) and the pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The local site runs at `http://localhost:4321`. Copy `.env.example` to `.env` only
when testing the mail integration with a dedicated test account. Reading pages
and running the regression tests do not require live credentials.

## Verification

```sh
pnpm check       # Astro and TypeScript diagnostics
pnpm test        # Regression tests; provider requests are mocked
pnpm build       # Static pages, social images, and Vercel server bundle
pnpm verify      # All three checks
pnpm audit --prod
```

The same `pnpm verify` checks run on pull requests and pushes to `main`.

Stop the development server before a production build and restart it afterward;
the two modes share Vite's dependency cache. Before shipping UI changes, inspect
320px and desktop layouts, keyboard focus, dark/light modes, and the essay demos.
Never submit a real newsletter form or replay a real inbound webhook just to test
this site: those actions can send email. Mocked tests deliberately avoid delivery.

## Content and styling

- Essays live in `src/content/essays/<slug>/index.md` or `index.mdx`.
- `draft: true` excludes an essay from both public pages and social images.
- The folder name is its public URL. Keep existing slugs stable.
- Shared page metadata and font loading live in `src/layouts/Layout.astro`.
- Use `STYLEGUIDE.md` and the existing Tailwind/global CSS conventions. Preserve
  the narrow column, neutral palette, and hand-drawn inline link treatment.

## Newsletter

`POST /api/newsletter` accepts JSON `{ "email": "..." }` or a normal URL-encoded
HTML form. It validates and bounds input, looks up the existing contact, restores
an explicitly requested subscription if needed, and sends `newsletter.signup`
for new contacts. A failed welcome event can be retried within 24 hours of contact
creation with the same idempotency key; established subscribers do not restart
that automation. Provider errors return a retryable message without exposing
provider details. Provider-side idempotency is time-limited, not permanent
exactly-once delivery.

Configure `RESEND_API_KEY`; optionally set `RESEND_NEWSLETTER_EVENT_NAME`.
The existing audience ID is in `src/lib/resendNewsletter.ts`.

Migration links can still use:

```text
https://tadaspetra.com/newsletter?email={{email}}
```

They now prefill the form and require pressing **Subscribe**. Merely opening a
GET link never creates a subscription, including when an email scanner previews
it. The page is not cached and does not send its query string as a referrer.

Browser storage is optional. Successful signup feedback remains visible; the
newsletter section is hidden on future visits when the flag can be stored. The
standalone newsletter page is always available.

## Inbound mail

`POST /api/resend/inbound` requires `RESEND_API_KEY` and
`RESEND_WEBHOOK_SECRET`. It verifies the signature before any provider request,
forwards received mail to the existing configured recipient, preserves reply and
thread headers, retrieves all attachment pages, and uses an email-ID idempotency
key. Set `RESEND_FORWARD_FROM` to override the default forwarding sender.
Unexpected failures return 503 for webhook retries. No live email delivery is
part of automated verification.
