# Dependency upgrade pending approval

Audit checked on September 23, 2026 with `pnpm audit --prod`.
Compatible updates reduced findings from 90 to 14: 1 critical, 4 high,
6 moderate, and 3 low. These counts include build tooling, not just exposed
runtime paths; the audit is not evidence that every advisory is exploitable here.

The automatic approval reviewer rejected a blanket major-version upgrade.
No major upgrade has been applied. The focused proposal is:

| Package | Installed | Target |
| --- | --- | --- |
| Astro | 5.18.2 | 7.3.4 |
| @astrojs/vercel | 9.0.5 | 11.0.11 |
| @astrojs/mdx | 4.3.14 | 8.0.2 |
| @astrojs/react | 4.4.2 | 7.0.0 |
| Sharp | 0.34.5 | At least 0.35.4, with matching Astro support |

Before applying: resolve required peer dependencies using the registry, pin
compatible versions, and retain the existing pnpm major. Do not upgrade unrelated
packages across majors.

Migration changes:

1. Move `src/content/config.ts` to `src/content.config.ts`, use Astro's glob loader
   and `astro/zod`, and generate IDs from each essay folder name to preserve URLs.
2. Replace `post.render()` with `render(post)` and check all eight essay URLs,
   the legacy redirect, social-image URLs, draft exclusion, and date formatting.
3. Adjust only adapter/integration options removed by the new releases.
4. Run type checks, all regression tests, the full build, and a fresh audit.
5. Verify both MDX essays and newsletter SSR from the production output in the
   browser at narrow and wide widths. Verify the generated Vercel function too.

The major upgrade is a release gate because it affects content compilation,
bundling, image processing, and deployment. Keep the working simplification pass
reviewable separately if migration reveals a third-party integration blocker.

References: [Astro 6 migration](https://docs.astro.build/en/guides/upgrade-to/v6/),
[Astro 7 migration](https://docs.astro.build/en/guides/upgrade-to/v7/).

## Remaining advisories

| Package | Severity | Advisory |
| --- | --- | --- |
| @astrojs/vercel | moderate | [Astro: Unauthenticated Path Override via `x-astro-path` / `x_astro_path`](https://github.com/advisories/GHSA-mr6q-rp88-fx84) |
| astro | moderate | [Astro: XSS in define:vars via incomplete </script> tag sanitization](https://github.com/advisories/GHSA-j687-52p2-xcff) |
| astro | low | [Astro: Server island encrypted parameters vulnerable to cross-component replay](https://github.com/advisories/GHSA-xr5h-phrj-8vxv) |
| esbuild | low | [esbuild allows arbitrary file read when running the development server on Windows](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) |
| astro | moderate | [Astro: XSS via Unescaped Attribute Names in Spread Props](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9) |
| sharp | high | [sharp inherited vulnerabilities in libvips: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) |
| astro | moderate | [Astro: XSS via unescaped spread attribute names in renderHTMLElement (incomplete fix for CVE-2026-54298)](https://github.com/advisories/GHSA-f48w-9m4c-m7f5) |
| astro | low | [Astro: Cross-site scripting via unescaped transition:* directive values on hydrated islands](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2) |
| astro | moderate | [Astro: Reflected XSS via unescaped View Transition animation properties](https://github.com/advisories/GHSA-4g3v-8h47-v7g6) |
| astro | high | [Astro: Host header SSRF in prerendered error page fetch](https://github.com/advisories/GHSA-2pvr-wf23-7pc7) |
| astro | high | [Astro: Reflected XSS via unescaped slot name](https://github.com/advisories/GHSA-8hv8-536x-4wqp) |
| astro | critical | [Astro: Remote code execution through AVIF image optimization](https://github.com/advisories/GHSA-26w7-cxv4-gfx2) |
| astro | moderate | [Astro: Authorization bypass from missing path-segment boundary check when stripping the configured base](https://github.com/advisories/GHSA-376h-93r7-7g6f) |
| sharp | high | [sharp: Vulnerabilities in libheif: GHSA-g89c-p67h-r497 and GHSA-2jg2-4ch7-h545](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) |
