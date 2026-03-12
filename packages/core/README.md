# @obscrd/core

Obfuscation engine — scrambles text, traps scrapers, blocks clipboard extraction.

## Install

```bash
npm install @obscrd/core
```

## Quick Start

```ts
import { createSeed, obfuscateText } from '@obscrd/core'

const seed = createSeed()
const result = obfuscateText('Sensitive content', { seed, level: 'medium' })

// result.html  → scrambled HTML that renders correctly
// result.css   → CSS rules to reconstitute the text
// result.ariaText → clean text for screen readers (empty at 'maximum' level)
```

## CLI

### `npx obscrd init`

Generate a project seed and write it to `.env`:

```bash
npx obscrd init
# ✓ Generated seed: a7f3b2c8e1d9f4a6...
# ✓ Written to .env as OBSCRD_SEED
```

### `npx obscrd seed`

Print a random seed (useful for piping):

```bash
npx obscrd seed
```

## API

### `createSeed()`

Generate a cryptographic seed for deterministic obfuscation.

```ts
const seed = createSeed() // → '3a7f2b...' (32-char hex)
```

### `deriveSeed(masterSeed, contentId)`

Derive a sub-seed for a specific content block. Returns a 16-character hex string (64-bit, collision-safe up to ~4 billion blocks).

```ts
const sub = deriveSeed(seed, 'article-title') // → '8f3a1c02d7e9b4f6'
```

### `obfuscateText(text, options)`

Obfuscate a text string into scrambled HTML + CSS that renders normally.

```ts
const result = obfuscateText('Hello world', { seed, level: 'medium' })
```

**Levels:**

- `light` — shuffles word order only, minimal overhead
- `medium` — shuffles words + characters, adds decoy characters
- `maximum` — all of medium + zero-width characters + `user-select: none`

Returns `ObfuscationResult`: `{ html, css, ariaText, contentId }`

> **Note:** At `maximum` level, `ariaText` returns an empty string to prevent plaintext leakage.

### `obfuscateEmail(email)`

Obfuscate an email address using RTL text reversal + decoy characters.

```ts
const { html, css } = obfuscateEmail('user@example.com')
```

### `obfuscatePhone(phone)`

Same technique as email, optimized for phone number characters.

```ts
const { html, css } = obfuscatePhone('+1-555-123-4567')
```

### `obfuscateAddress(address)`

Shuffles address words with decoy address fragments.

```ts
const { html, css } = obfuscateAddress('123 Main St, Springfield')
```

### `generateHoneypot(options?)`

Generate hidden HTML traps for AI scrapers with copyright notices and prompt injection.

```ts
const html = generateHoneypot({
  copyrightNotice: 'Acme Corp',
  contentId: 'page-123',
  promptInjection: true, // default
})
```

### `createClipboardInterceptor(target?)`

Intercepts copy events and scrambles the clipboard content. Optionally pass a DOM element to scope interception to that subtree — without a target, it attaches to `document`.

```ts
const interceptor = createClipboardInterceptor()       // intercepts all copy events
interceptor.attach()
interceptor.detach()

const scoped = createClipboardInterceptor(myElement)   // only intercepts within myElement
scoped.attach()
scoped.detach()
```

### `detectDevTools(onDetect)`

Detect when browser DevTools are opened using the debugger-timing heuristic.

```ts
const detector = detectDevTools(() => console.warn('DevTools detected'))
detector.start()
detector.stop()
```

## Types

```ts
import type { ObscrdConfig, ObfuscationResult, ObfuscateOptions, HoneypotOptions } from '@obscrd/core'
```

## License

MIT
