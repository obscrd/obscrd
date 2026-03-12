# Obscrd Roadmap

## v0.1 — Content Protection MVP ✅

### Core Engine (`@obscrd/core`)
- ✅ Deterministic text obfuscation with seeded PRNG (Mulberry32, 3 protection levels)
- ✅ CSS Flexbox reordering via `data-o` attributes, decoy character injection, zero-width characters
- ✅ Contact obfuscation: `obfuscateEmail`, `obfuscatePhone`, `obfuscateAddress` (RTL rendering + decoys)
- ✅ Seed management: `createSeed()` (crypto-secure) and `deriveSeed()` (FNV-1a deterministic sub-seeds)
- ✅ Honeypot generation with copyright traps, AI prompt injection strings, content ID watermarking
- ✅ Clipboard interception with Fisher-Yates text scrambling (element-scoped)
- ✅ DevTools detection with debugger timing heuristic and binary exponential backoff
- ✅ CLI: `obscrd init` (generate seed → `.env`) and `obscrd seed` (print random seed)

### React Components (`@obscrd/react`)
- ✅ `ObscrdProvider` — context-based config, optional seed, SSR-safe, DevTools integration, auto-honeypot
- ✅ `ProtectedText` — 14 semantic HTML elements via `as` prop, 3 protection levels, sr-only accessibility
- ✅ `ProtectedEmail` — mailto link with subject/body/cc/bcc, RTL obfuscation
- ✅ `ProtectedPhone` — tel/sms link support, RTL obfuscation
- ✅ `ProtectedLink` — deferred href loading, right-click prevention
- ✅ `ProtectedImage` — canvas-based rendering, drag/right-click prevention, responsive via ResizeObserver
- ✅ `ProtectedBlock` — container for scoped clipboard interception
- ✅ `Honeypot` — standalone copyright trap injection
- ✅ `Breadcrumb` — forensic tracking via hidden data attributes, deterministic ID generation
- ✅ `useObscrd()` and `useProtectedCopy()` hooks

### AI Crawler Blocking (`@obscrd/robots`)
- ✅ 20 AI crawler definitions (OpenAI, Anthropic, Google, Meta, ByteDance, etc.)
- ✅ `generateRobotsTxt()` with block/allow lists, custom rules, sitemap support
- ✅ `createMiddleware()` — universal handler for Express, Fastify, Node http

### Infrastructure
- ✅ Bun monorepo with tsup build (ESM + CJS + DTS)
- ✅ Biome linting/formatting, Husky + lint-staged pre-commit hooks
- ✅ CI pipeline (build → typecheck → lint → test)
- ✅ Release pipeline with automated version bumping and NPM publish
- ✅ WCAG 2.2 AA accessibility (sr-only spans, aria-hidden, aria-label)

## v0.2 — Component Polish

### ProtectedText Enhancements
- ✅ `forwardRef` support on all components
- ✅ `id` prop on `ProtectedText`, `ProtectedEmail`, `ProtectedPhone`
- ✅ `displayName` on all components (survives minification in React DevTools)
- ✅ Narrow the `as` prop type to a curated list of text-bearing elements
- ✅ ~~`ariaText` for maximum level~~ — resolved: `ariaText` always returns clean text (sr-only span is visually hidden)
- ✅ Screen reader support via sr-only spans

### ProtectedEmail / ProtectedPhone
- ✅ Standard anchor props passthrough (`target`, `rel`) on both components
- ✅ `obfuscate` toggle prop on both components

### ProtectedImage
- ✅ Loading placeholder with pulse animation while image loads
- Canvas pixel noise injection (subtle noise overlay that corrupts pixel-level scraping)

### ProtectedLink
- `facetime` protocol support (`facetime:` URL scheme, iOS only)
- `obfuscateChildren` prop to disable child content obfuscation independently of href

### ProtectedBlock
- ✅ Scope clipboard interception to the block's DOM subtree (currently falls back to `document` when no target passed)

### Core
- ✅ Upgrade `deriveSeed` from 32-bit FNV-1a to a wider hash — birthday collisions likely after ~65K unique content blocks

## v0.3 — Style & Performance

### Style Deduplication
- Collect CSS rules into a single injected stylesheet instead of per-component `<style>` tags
- `ObscrdProvider` manages a style registry, components register their CSS on mount
- Removes duplicate `.obscrd-*` rules when multiple components share the same seed/content

### SSR Support
- Verify and document Next.js App Router / Pages Router compatibility
- Verify Remix and Astro compatibility
- Ensure hydration works correctly (deterministic seed → identical server/client HTML)

### Framework Integrations
- Next.js middleware for `@obscrd/robots` (native `middleware.ts` integration)
- Astro integration plugin
- Remix loader helper

## v0.4 — Server-Side Utilities

### Email Masking
- `maskEmail(email, options)` — server-side utility returning asterisk-masked email for display
- `hello@example.com` → `hel***@***.com`
- Configurable: `asterisksLength`, `visibleCharactersStart/End`, `showDomainName`, `showDomainExtension`

### Phone/Address Masking
- `maskPhone(phone, options)` — `+1-555-867-5309` → `+1-555-***-****`
- `maskAddress(address, options)` — `123 Main St, Springfield` → `*** Main St, ***`

## v0.5 — Dashboard & Analytics

### Project ID System
- `npx @obscrd/core init` generates a project ID (replaces raw seed)
- Project ID works identically to seed in the SDK — no breaking changes
- Dashboard at `obscrd.dev/dashboard` for project creation and ID management

### Breadcrumb Tracking
- Breadcrumb IDs phone home to a tracking API
- Dashboard shows: "your content was found on domain X"
- Webhook alerts for content theft detection

### Scraping Analytics
- Honeypot hit tracking (how many scrapers triggered the trap)
- Content protection coverage report (which pages have protection, which don't)

### Seed Rotation
- Automatic seed rotation on a schedule
- Changes obfuscation patterns periodically so scrapers can't cache decoders
- Managed via dashboard, transparent to the developer

## Ideas Backlog (Unscheduled)

### Content Fingerprinting
- Invisible Unicode watermarks embedded in text (homoglyph substitution)
- Each visitor gets a unique fingerprint — if content is republished, trace it to the source session
- Combines with breadcrumbs for forensic proof

### Headless Browser Detection
- Detect PhantomJS, Puppeteer, Playwright signatures
- Complement existing DevTools detection with bot-detection heuristics
- Serve degraded/decoy content to detected headless browsers

### Rate Limiting Integration
- Detect rapid sequential page loads (scraping pattern)
- Integrate with existing rate limiting middleware
- Progressive degradation: light protection → honeypot injection → content blocking

### Obfuscation Techniques
- CSS `content` property injection (render text via CSS pseudo-elements, not in HTML)
- Web font-based obfuscation (custom font that maps characters to different glyphs)
- SVG text rendering for headlines/critical content

### Platform Expansions
- `@obscrd/vue` — Vue 3 components
- `@obscrd/svelte` — Svelte components
- `@obscrd/solid` — SolidJS components
- `@obscrd/angular` — Angular directives
