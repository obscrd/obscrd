# Changelog

## 0.1.0 (unreleased)

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
