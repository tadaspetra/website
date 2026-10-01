# Astro and Sharp dependency migration

Implemented on October 1, 2026, for review in a draft PR. This supersedes the
September 23 proposal; that proposal's audit counts were historical.

## Resolved versions

Targets and required peers were rechecked against the npm registry on October 1.
The migration dependencies are pinned; pnpm remains at 10.13.1. Unrelated direct
package ranges and majors are unchanged.

| Package | Previous lockfile | Migrated |
| --- | --- | --- |
| Astro | 5.18.2 | 7.3.5 |
| @astrojs/vercel | 9.0.5 | 11.0.11 |
| @astrojs/mdx | 4.3.14 | 8.0.2 |
| @astrojs/react | 4.4.2 | 7.0.0 |
| Sharp | 0.34.5 | 0.35.5 |
| astro-expressive-code / line-numbers plugin | 0.41.7 | 0.44.2 |

Expressive Code 0.41.7 did not declare Astro 7 support; 0.44.2 does. Explicit
peers are `@astrojs/markdown-remark` 7.3.1, `@astrojs/markdown-satteri` 0.4.2,
and `oxc-transform-react` 0.145.0. React remains at 19.3.0.

## Migration behavior

- `src/content.config.ts` uses the glob loader and `astro/zod`. Collection IDs
  come from essay folder names, preserving all eight public URLs and image URLs.
- Essay pages use `render(post)` instead of the removed `post.render()` API.
- Markdown explicitly uses the supported `unified()` Remark/Rehype processor.
  Astro 7's default Sätteri processor failed to compile the Mermaid integration's
  raw HTML output in the Flutter MDX essay. Keeping the existing pipeline preserves
  Mermaid diagrams, MDX components, and Expressive Code tabs and line numbers.
- Vercel adapter options remain supported: analytics and the 60-second function
  duration are retained. The generated function targets Node 24.
- `pnpm verify` now also runs production-output regression checks after the build,
  including the packaged Vercel handler rather than just source-level tests.

## Fresh security audit

`pnpm audit --prod --json` on October 1, 2026:

| State | Critical | High | Moderate | Low | Total |
| --- | --- | --- | --- | --- | --- |
| Main lockfile before migration | 1 | 4 | 6 | 4 | 15 |
| Migrated lockfile | 0 | 0 | 0 | 0 | 0 |

The migration removes the Astro, adapter, Sharp, and esbuild advisories. The
remaining DOMPurify advisory was resolved by refreshing Mermaid's compatible
transitive patch to 3.4.16, without an override or a Mermaid major upgrade.
Audit counts include build dependencies; they do not establish exploitability.

## Validation

- Astro/TypeScript: zero errors, warnings, or hints.
- Existing mocked regression tests: 15 passed.
- Full build: eight essay pages, eight essay PNGs, root social PNG, five optimized
  images, static pages, and packaged Vercel server function generated.
- Production-output regression tests: 11 passed. They check essay URLs, dates,
  social images, hydrated component markers, the legacy 301 redirect, Vercel
  runtime/duration, newsletter SSR prefill/privacy headers, and invalid-input
  and foreign-origin API responses without sending mail.
- Draft exclusion: an additional build with a temporary `draft: true` essay
  passed 12 production checks, confirming no page, social image, or homepage link.
  The fixture was removed and the final output rebuilt.
- Production browser review at 320px and 1440px: both MDX essays and newsletter
  SSR render correctly; Mermaid diagrams, code tabs, and circuit controls work.
- No standalone lint script or linter is configured; `git diff --check` is used
  for whitespace validation alongside Astro's diagnostics.

Build warnings remain for large existing client chunks and Rolldown's handling
of Astro's internal `use astro:head-inject` directive. Browser checks confirm
styles and interactive assets load. Live email delivery is deliberately excluded;
provider behavior is covered by the existing mocked tests. This migration does
not authorize a merge or manual deployment.

References: [Astro 6 migration](https://docs.astro.build/en/guides/upgrade-to/v6/),
[Astro 7 migration](https://docs.astro.build/en/guides/upgrade-to/v7/),
[Markdown processors](https://docs.astro.build/en/guides/markdown-content/#setting-up-a-markdown-processor).
