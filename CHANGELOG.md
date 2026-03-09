# Changelog

## 0.2.2

### @obscrd/core
- Fixed SSR hydration mismatch: `generateHoneypot()` now accepts an optional `seed` for deterministic content ID generation instead of using `Math.random()`
- Without a seed or explicit `contentId`, honeypots use a static `'obscrd-hp'` fallback instead of a random ID

### CLI
- Fixed `obscrd init` writing to `.env` even when `.env.local` exists — now prefers `.env.local` (Next.js, Vite) and checks both files for existing `OBSCRD_SEED`

### @obscrd/react
- Fixed SSR hydration mismatch in `Breadcrumb` — derives deterministic ID from provider seed via `deriveSeed` instead of `Math.random()`
- Fixed SSR hydration mismatch in `ObscrdProvider` — when no seed is provided, defers protection rendering until client mount to avoid server/client divergence
- `Honeypot` component now passes provider seed through to `generateHoneypot` for deterministic output
- `ObscrdProvider` auto-injected honeypot now uses the resolved seed for deterministic IDs

### Performance
- `escapeHtml` rewritten as single-pass regex (was 5 sequential `.replace()` calls)
- `ObscrdProvider` context value memoized — prevents cascading re-renders across all consumer components
- DevTools detection uses exponential backoff (1s → 5s) instead of fixed 1s polling
- `Breadcrumb` reuses shared `srOnly` style constant instead of creating inline object per render
- `createSeed` fallback uses array join instead of loop string concatenation
- Decoy character sets extracted to module-level constants (`@obscrd/core`)
- `generateRobotsTxt` allow-list uses `Set` lookup instead of O(n×m) array iteration

### Build
- Enabled minification across all packages (core −42%, react −42%, robots −25% bundle size)
- Added `"sideEffects": false` to all packages for better consumer tree-shaking

## 0.2.1

### @obscrd/react
- Added `crossOrigin` prop to `ProtectedImage` — opt-in CORS support for CDN/cross-origin images, with a console warning when the canvas gets tainted without it
- Added `objectFit` prop to `ProtectedImage` (`'fill' | 'cover' | 'contain' | 'none'`) — implements CSS `object-fit` equivalent on canvas via `drawImage` math
- CSS-driven sizing: `ProtectedImage` no longer forces `width: 200px, height: 150px` when no explicit dimensions are passed — Tailwind/CSS classes now control sizing, with a `ResizeObserver` redrawing the canvas buffer on resize

## 0.2.0

### @obscrd/core
- Upgraded `deriveSeed` from 32-bit to 64-bit hash (double FNV-1a), moving collision threshold from ~65K to ~4B blocks
- Scoped clipboard interception: `createClipboardInterceptor` now accepts an optional `target` element
- Fixed `ariaText` leaking plaintext at `maximum` protection level (now returns empty string)

### @obscrd/react
- Added `forwardRef` to all components: `ProtectedText`, `ProtectedLink`, `ProtectedEmail`, `ProtectedPhone`, `ProtectedImage`, `ProtectedBlock`, `Honeypot`, `Breadcrumb`
- Added `displayName` to all components for React DevTools
- Added `id` prop to `ProtectedText`, `ProtectedLink`, `ProtectedEmail`, `ProtectedPhone` for anchor linking
- Added `obfuscate` toggle to `ProtectedEmail` and `ProtectedPhone` for debugging
- Added `target` and `rel` passthrough on `ProtectedEmail` and `ProtectedPhone`
- Narrowed `ProtectedText` `as` prop from `keyof HTMLElementTagNameMap` to curated text-bearing elements
- `ProtectedBlock` clipboard interception now scoped to its subtree instead of the entire document
- `ProtectedImage` shows a loading skeleton (pulse animation) instead of hiding the canvas before load

## 0.1.2

### @obscrd/core
- Seed-based text obfuscation engine with three protection levels (light, medium, maximum)
- Contact info protection: email, phone (RTL reversal), address (flex-order shuffle)
- AI honeypot generation with copyright traps and prompt injection
- Clipboard interception
- DevTools detection (debugger-timing heuristic)

### @obscrd/react
- `ObscrdProvider` for configuration context
- `ProtectedText` — text obfuscation with CSS reconstitution
- `ProtectedEmail` / `ProtectedPhone` — contact protection with sr-only accessibility
- `ProtectedImage` — canvas-based image rendering (no `<img>` in DOM)
- `ProtectedLink` — hides href from scrapers until user interaction (hover/focus)
- `ProtectedBlock` — clipboard interception wrapper
- `Honeypot` — invisible AI scraper traps
- `Breadcrumb` — forensic tracking markers
- `useObscrd` / `useProtectedCopy` hooks

### @obscrd/robots
- `generateRobotsTxt()` — block 20+ AI crawlers with filtering options
- `createMiddleware()` — framework-agnostic middleware for Express/Fastify/Node
- `AI_CRAWLERS` — exported crawler database
