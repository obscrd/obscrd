# Security Model & Limitations

Obscrd is a **content obfuscation toolkit**, not a cryptographic security layer. It is designed
to raise the cost of automated content scraping and casual copying — not to provide tamper-proof
protection against determined attackers.

## What Obscrd Protects Against

- **Naive web scrapers** that parse raw HTML without executing JavaScript
- **Casual copy-paste** by making clipboard output scrambled or empty
- **Simple bot crawlers** via robots.txt directives and honeypot traps
- **Right-click / drag-and-drop saving** of protected images
- **Direct URL exposure** of images in the DOM (rendered via canvas)

## What Obscrd Does NOT Protect Against

- **Headless browsers** (Puppeteer, Playwright) that can execute JavaScript, trigger
  DOM events, and extract content programmatically
- **DOM inspection** — obfuscated text uses CSS ordering (`data-o` attributes) and
  RTL reversal that can be reversed by reading the DOM structure
- **DevTools access** — all React component props (emails, URLs, image sources) are
  visible in React DevTools; browser DevTools detection uses a timing heuristic that
  is trivially bypassed by disabling breakpoints or using headless browsers
- **Network-level extraction** — image URLs are visible in the browser Network tab
  even though they don't appear in the HTML source
- **Screenshots and OCR** — canvas-rendered images can be screenshotted; no pixel-level
  watermarking or obfuscation is applied
- **Accessibility tools** — screen-reader-accessible spans contain plaintext by design
  (WCAG 2.2 AA compliance); this is an intentional trade-off
- **User-agent spoofing** — `@obscrd/robots` generates advisory robots.txt rules;
  crawlers are not required to respect them and can spoof their identity
- **Async clipboard API** — clipboard protection intercepts `copy` events but does not
  block `navigator.clipboard`, `window.getSelection()`, or `cut` events

## Cryptographic Properties

Obscrd does **not** use cryptographic primitives for content protection:

- Seed derivation uses FNV-1a (a non-cryptographic hash) for performance and determinism
- Shuffling uses Mulberry32 PRNG (not cryptographically secure)
- Falls back to `Math.random()` when the Web Crypto API is unavailable
- Obfuscation is deterministic by design (same seed + content = same output)

These choices are intentional — Obscrd prioritizes fast, deterministic rendering compatible
with SSR over cryptographic strength. **Do not use Obscrd to protect passwords, API keys,
PII, or any data requiring confidentiality guarantees.**

## Honeypots & Breadcrumbs

Honeypots serve as **forensic evidence of scraping**, not as prevention mechanisms:

- Hidden copyright notices and AI prompt injections are embedded in the DOM
- Breadcrumb IDs enable tracking of content provenance
- These are detectable by sophisticated scrapers that filter `aria-hidden` elements
  or match known text patterns (e.g. `data-content-id`, `data-obscrd-breadcrumb`)
- Honeypot text is not obfuscated and uses a recognizable hidden-content CSS pattern

## SSR Considerations

- **Always provide a seed** to `ObscrdProvider` for SSR — without a seed, content renders
  unprotected until client-side JavaScript mounts (flash of unprotected content)
- Deterministic IDs (v0.2.2+) prevent hydration mismatches between server and client
- `ProtectedLink` depends on client-side JavaScript — the `href` is `"#"` until user
  interaction (mouse enter / focus), so it requires JS to function

## DevTools Detection

The built-in DevTools detector uses a `debugger` statement timing heuristic:

- Polls every 1 second using `new Function('debugger')()`
- Measures execution time; >100ms suggests a breakpoint was hit
- **Bypasses**: disabling breakpoints, headless browsers, CSP blocking `new Function`,
  patching `performance.now()`, or inspecting between polling intervals
- Detection is opt-in (`devtools` prop) and only triggers a callback — it does not
  block content access

## Recommended Threat Model

| Use Case | Effectiveness |
|----------|--------------|
| Blocking naive HTML scrapers | High |
| Deterring casual copy-paste | High |
| Forensic scraping detection (honeypots) | Medium |
| Blocking AI training crawlers (robots.txt) | Medium (advisory) |
| Preventing image hotlinking | Medium |
| Stopping determined attackers | Low |
| Protecting sensitive/confidential data | Not suitable |

## Recommendations for Higher Security

For use cases requiring stronger protection, combine Obscrd with server-side measures:

- **Rate limiting** on content-serving endpoints
- **Authentication** for premium/protected content
- **IP-based crawler verification** (reverse DNS lookups against known crawler ranges)
- **DRM solutions** for high-value media assets
- **Server-side rendering with authentication** to prevent unauthenticated HTML access
- **Content Security Policy (CSP)** headers to restrict script execution

## Reporting Vulnerabilities

If you discover a security vulnerability in Obscrd, please report it responsibly
by emailing [security@obscrd.dev](mailto:security@obscrd.dev). Do not open a
public issue for security vulnerabilities.
