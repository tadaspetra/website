# Simplification and interface review

Full review of the Astro routes, shared layout/CSS, newsletter and inbound mail
handlers, social-image generation, both MDX essays, their React/Astro components,
and dependency/build configuration. Styling remains Tailwind plus the existing
shared CSS. The written essays, archived writing, and original artwork are kept.

## Interface coverage

| Category | Evidence inspected | Result |
| --- | --- | --- |
| Typography | Shared CSS/layout, all page headings, 320px and 1280px layouts | Static Inter metrics retained; cached fonts, balanced headings, readable placeholders |
| Surfaces | Homepage, newsletter, experience, 404, essay images and code | Minimal neutral styling preserved; mobile gutters and focus/hit areas improved |
| Animations | Circuit demos, newsletter feedback, achievement illustration | Removed frame-by-frame React updates and pointer tilt; CSS reduced-motion rule added |
| Icons | Sources arrow, code tabs, diagram controls | Native disclosure; named stateful keyboard controls; unique SVG IDs |
| Performance | Build output, font loading, hydrated components, source diffs | Fewer client scripts, no static-art hydration, shared particle drawing, simpler OG options |

## Changes by principle

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/components/Sources.astro:13` | Scripted visually hidden source links still focusable | Native details/summary, full source labels, larger rows | Keyboard access and honest hidden state |
| HIGH | `src/content/essays/how-the-computer-works/_components/{SwitchAndGate,SwitchAndTransistor,TransistorAndGate,RGBLightDemo}.tsx` | Click-only SVG controls | Named focusable controls, Enter/Space, aria-pressed, unique IDs | Keyboard and assistive-technology access |
| MEDIUM | `src/layouts/Layout.astro:30`, `src/styles/global.css:3` | Storage exceptions interrupt initialization; theme class differs from Tailwind media rules | Optional storage, shared class-based theme selector | Resilient, consistent theme state |
| MEDIUM | `src/components/NewsletterSignup.astro:30`, `src/pages/newsletter.astro` | JS-only form; feedback disappears after 1.2 seconds; storage failure reports signup failure | Native POST fallback, bounded request, persistent live feedback, optional storage, standalone h1 | Recoverable form states and visible completion |
| MEDIUM | `src/layouts/Layout.astro:98`, shared page mains | All article links forced into new tabs; no skip link | Normal link behavior and keyboard skip link | Predictable navigation |
| MEDIUM | `src/styles/global.css:194`, `src/styles/global.css:652` | Focus style applies only to links; faint placeholder; small touch actions | Shared focus-visible rule, darker placeholder, coarse-pointer 44px target minimum | Focus visibility and usable targets |
| MEDIUM | `src/styles/global.css:688` | All mobile tables receive invented Step/Action/Why labels | Original headings remain in horizontally scrollable tables | Preserve meaning across breakpoints |
| MEDIUM | `src/content/essays/how-the-computer-works/_components/TransistorAndGate.tsx:27` | Boolean output outside SVG viewBox | ViewBox contains the output | Prevent clipped state feedback |
| MEDIUM | `src/content/essays/how-the-computer-works/_components/FlowParticles.tsx:9`, `useClickSound.ts:3`, `src/styles/global.css:723` | Three React animation loops; eager audio pools; broad transitions | Shared CSS particle motion, lazy audio with rejection handling, explicit transitions, reduced-motion support | Motion restraint and fewer render-time effects |
| LOW | `src/content/essays/flutter-was-never-the-end-goal/_components/AchievementCards.tsx:48`, essay MDX | Static artwork hydrated for pointer tilt | Static composition and lazy images | Remove incidental animation/runtime while retaining the artwork |
| LOW | `src/layouts/Layout.astro:3`, `src/styles/global.css:5` | Five fonts read from disk and embedded in every page; duplicated base CSS | Cached static font assets with primary font preloads; one shared base stylesheet | Less repeated HTML and no runtime font-file dependency |
| LOW | `src/styles/global.css:120`, `src/styles/global.css:380` | Fixed 24px mobile gutters; duplicated diagram theme rules | 16px mobile gutters and shared diagram color variables | Comfortable narrow layout and simpler maintenance |
| LOW | `src/content/essays/flutter-was-never-the-end-goal/_components/{CodeComparison.astro,ConcentricCircles.tsx}` | Fixed IDs; small code tabs; unused snippet metadata | Per-instance IDs, 40px tabs, less metadata | Safer reuse and accessible controls |

## Considered and rejected

| Location | Candidate | Rejected because |
| --- | --- | --- |
| Shared page shell | Add navigation cards or decorative sections | Would change the site's deliberately minimal composition |
| Essay SVG drawings | Replace detailed illustrations with generic UI switches | Their drawings teach the concepts; simplify behavior without removing the illustrations |
| Font system | Switch to variable Inter | Existing static instances intentionally avoid Safari reshaping; preserve that choice |

## Reliability changes

Newsletter requests validate unknown input shapes and body sizes, reject
cross-origin submissions, and use one subscription service. Provider lookup
failures cannot fall through to contact creation. Existing unsubscribe state is
handled explicitly. A recent contact can retry its welcome event with the same
payload and idempotency key. GET migration links prefill instead of subscribing.

Inbound forwarding verifies signatures, follows attachment pagination, avoids
partial forwarding on failed downloads, and returns retryable unexpected errors.
Regression tests mock provider traffic. `pnpm verify` and a minimal GitHub Actions
workflow provide repeatable type, test, and production-build checks.

## Verification

- `pnpm verify`: zero type errors/warnings; 15 tests passed; production build passed.
- Browser: all eight essays, home, experience, newsletter, and 404 checked for
  horizontal overflow at 320px and 1280px; none found. One h1 per page.
- Visual inspection: desktop and mobile homepage, both themes, experience,
  newsletter, article typography, circuit states, and narrow code tabs.
- Keyboard: sources disclosure, AND-gate switches, transistor inputs, RGB LEDs,
  code-tab arrow navigation, and empty-form native validation worked.
- Built Vercel newsletter handler renders with cached fonts. Built circuit demos
  hydrate and toggle correctly; no JavaScript errors in that check.
- Local API: malformed JSON values return 400, cross-origin POST returns 403,
  invalid HTML form POST redirects with 303, unsigned webhook returns 400.
- Storage denial, duplicate submission, response parse failure, provider failure,
  event retry, attachment pagination/failure, and header sanitization are covered
  by regression tests. No live mail was sent.
- Not verified: live email delivery, remote CI, full cross-browser matrix,
  OS-level reduced-motion emulation, and animation replay at 10% speed.

Interface verdict: no known actionable interface findings remain in the verified
states. Unverified states above remain explicit; this is not an exhaustive
accessibility certification. Release verdict: **Block** pending the remaining
security dependency migration documented in `dependency-upgrade.md`.
