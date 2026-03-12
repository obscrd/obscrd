# Security

obscrd raises the cost of automated scraping. It is not DRM and not a cryptographic security layer. Do not use it to protect passwords, API keys, PII, or anything requiring confidentiality.

## What it stops

- HTML scrapers reading `textContent` or `innerHTML`
- Casual copy-paste (clipboard output is scrambled)
- Simple bot crawlers (robots.txt + honeypot traps)
- Right-click / drag-and-drop image saving
- Direct image URL exposure in the DOM (canvas rendering)

## What it does not stop

- **Headless browsers** (Puppeteer, Playwright) that execute JS and read rendered content
- **DOM inspection** — CSS ordering via `data-o` attributes and RTL reversal can be reversed by reading DOM structure
- **React DevTools** — component props (emails, URLs, image sources) are visible
- **Browser DevTools** — detection uses a timing heuristic, trivially bypassed by disabling breakpoints
- **Network tab** — image URLs are visible even though `<img>` tags are absent from HTML
- **Screenshots + OCR** — no pixel-level watermarking is applied
- **Screen readers** — plaintext is available by design (WCAG 2.2 AA compliance)
- **UA spoofing** — robots.txt is advisory; crawlers can ignore it
- **Async clipboard API** — `navigator.clipboard` and `window.getSelection()` are not intercepted

## Crypto properties

obscrd does not use cryptographic primitives:

- Seed derivation: FNV-1a (non-cryptographic, chosen for speed + determinism)
- Shuffling: Mulberry32 PRNG (not cryptographically secure)
- Fallback: `Math.random()` when Web Crypto API is unavailable
- Deterministic by design — same seed + content = same output

These are performance trade-offs for SSR compatibility, not oversights.

## Honeypots + breadcrumbs

Forensic evidence, not prevention:

- Hidden copyright notices and prompt injections in the DOM
- Breadcrumb IDs track content provenance
- Detectable by scrapers that filter `aria-hidden` elements or match known attributes (`data-content-id`, `data-obscrd-breadcrumb`)
- Honeypot text is not obfuscated and uses a recognizable hidden-content CSS pattern

## SSR

- Always provide a `seed` — without one, content is unprotected until JS mounts
- Deterministic IDs (v0.2.2+) prevent hydration mismatches
- `ProtectedLink` href is `"#"` until user interaction (hover/focus), requires JS

## DevTools detection

Uses a `debugger` statement timing heuristic:

- Polls every 1s via `new Function('debugger')()`
- Execution >100ms suggests a breakpoint was hit
- Bypasses: disable breakpoints, headless browsers, CSP blocking `new Function`, patching `performance.now()`
- Opt-in (`devtools` prop), triggers a callback only — does not block content

## Effectiveness

| Use case | Effectiveness |
|----------|--------------|
| Blocking HTML scrapers | High |
| Deterring copy-paste | High |
| Forensic scraping detection | Medium |
| Blocking AI crawlers (robots.txt) | Medium (advisory) |
| Preventing image hotlinking | Medium |
| Stopping determined attackers | Low |
| Protecting confidential data | Not suitable |

## Combining with server-side measures

For stronger protection, pair obscrd with:

- Rate limiting on content endpoints
- Authentication for premium content
- IP-based crawler verification (reverse DNS against known crawler ranges)
- CSP headers to restrict script execution
- Server-side rendering behind auth

## Reporting vulnerabilities

Email [security@obscrd.dev](mailto:security@obscrd.dev). Do not open a public issue.
