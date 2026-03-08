# Obscrd Roadmap

## v0.2 — Component Polish

### ProtectedLink Enhancements
- `facetime` protocol support (`facetime:` URL scheme, iOS only)
- `obfuscateChildren` prop to disable child content obfuscation independently of href obfuscation

### ProtectedText Enhancements
- `forwardRef` support on all components (needed for animation libraries, scroll-to, integration with component systems)
- `id` prop on `ProtectedText`, `ProtectedEmail`, `ProtectedPhone` (anchor linking to protected headings)
- `displayName` on all components (survives minification in React DevTools)
- Narrow the `as` prop type from `keyof HTMLElementTagNameMap` to a curated list of text-bearing elements

### ProtectedEmail / ProtectedPhone
- Standard anchor props passthrough (`target`, etc.) beyond what ProtectedLink already provides
- `obfuscate` toggle prop (matching ProtectedText and ProtectedLink)

### ProtectedBlock
- Scope clipboard interception to the block's DOM subtree (currently attaches to `document` globally)
- Document the global interception as a known limitation until scoped

### ProtectedImage
- Canvas pixel noise injection (subtle noise overlay that doesn't affect visual quality but corrupts pixel-level scraping)
- Loading skeleton/placeholder while image loads (before canvas draws)

### Core
- Upgrade `deriveSeed` from 32-bit FNV-1a to a wider hash — birthday problem means collisions likely after ~65K unique content blocks
- `ariaText` for maximum level should return empty string or generic placeholder, not clean plaintext

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

### Email Masking (inspired by obfuscate-mail)
- `maskEmail(email, options)` — server-side utility that returns asterisk-masked email for display
- `hello@example.com` → `hel***@***.com`
- Configurable: `asterisksLength`, `visibleCharactersStart/End`, `showDomainName`, `showDomainExtension`
- Use case: account settings, password reset confirmations, admin dashboards
- Different from `obfuscateEmail` which is client-side DOM obfuscation

### Phone/Address Masking
- `maskPhone(phone, options)` — `+1-555-867-5309` → `+1-555-***-****`
- `maskAddress(address, options)` — `123 Main St, Springfield` → `*** Main St, ***`

## v0.5 — Dashboard & Analytics

### Project ID System
- `npx @obscrd/core init` generates a project ID (replaces raw seed)
- Project ID works identically to seed in the SDK — no breaking changes
- Dashboard at `obscrd.dev/dashboard` lets users create projects and get IDs

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
- Complement the existing DevTools detection with bot-detection heuristics
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
