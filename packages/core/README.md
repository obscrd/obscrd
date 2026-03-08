# @obscrd/core

Content protection engine — obfuscate text, trap scrapers, and defend against AI bots.

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
// result.ariaText → clean text for screen readers
```

## API

### `createSeed()`

Generate a cryptographic seed for deterministic obfuscation.

```ts
const seed = createSeed() // → '3a7f2b...' (32-char hex)
```

### `deriveSeed(masterSeed, contentId)`

Derive a sub-seed for a specific content block.

```ts
const sub = deriveSeed(seed, 'article-title') // → '8f3a1c02'
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

### `createClipboardInterceptor()`

Intercepts copy events and scrambles the clipboard content.

```ts
const interceptor = createClipboardInterceptor()
interceptor.attach() // start intercepting
interceptor.detach() // stop
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
