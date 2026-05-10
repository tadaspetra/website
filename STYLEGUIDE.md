# Website Style Guide

Use this guide when creating or changing pages and components. The site should feel quiet, personal, and direct. Prefer restraint over decoration.

## Layout

- Default to a centered `max-w-2xl` content column with `px-4 sm:px-6`.
- Use open vertical space instead of containers to create hierarchy.
- Match the homepage rhythm for normal pages: `py-12 sm:py-16 md:py-24`.
- Avoid boxed sections unless the existing page already uses that pattern for a specific purpose.
- Do not add cards, shadows, dashed borders, gradients, or decorative backgrounds by default.

## Typography

- Let global heading styles do most of the work.
- Use `h1` and `h2` naturally instead of custom heading sizes unless the surrounding page already does.
- Body copy should usually be `text-sm sm:text-base text-neutral-500 dark:text-neutral-400`.
- Keep copy short and plain. The site sounds conversational, not product-marketing heavy.
- Avoid page-specific cleverness for utility routes like 404 pages, forms, and confirmations.

## Links And Actions

- Use normal links for inline text so the hand-drawn underline appears.
- Use `plain-link` for blocks, cards, footer links, and button-like links.
- For a primary utility action, match the `/newsletter` route button:

```astro
<a
  class="plain-link inline-flex items-center justify-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
  href="/"
>
  Back home
</a>
```

- For simple lists of internal links, match the homepage essay links:

```astro
<a
  href="/example"
  class="plain-link block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm sm:text-base"
>
  Example
</a>
```

## Color

- Prefer neutral Tailwind colors already used in the site.
- Primary text should be `text-neutral-900 dark:text-white` when needed.
- Secondary text should be `text-neutral-500 dark:text-neutral-400`.
- Muted metadata can use `text-neutral-400 dark:text-neutral-500`.
- Do not introduce new accent colors unless the existing page already establishes them.

## Components

- Start from existing components before inventing new presentation styles.
- Keep component APIs small and explicit.
- React components should use explicit `interface` declarations for props.
- Astro components should keep markup simple and rely on Tailwind utilities already present in nearby files.
- If a new component needs a boxed visual treatment, first check whether the page already has a comparable pattern.

## Before Shipping

- Compare the new work against `src/pages/index.astro` and `src/pages/newsletter.astro`.
- Ask: would this look at home beside the homepage, footer, and newsletter confirmation page?
- Remove visual decoration that is only there to make the component feel more "designed."
- Run `pnpm build` for substantive changes.
