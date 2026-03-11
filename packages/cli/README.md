# obscrd

CLI for [Obscrd](https://obscrd.dev) — content protection SDK for React.

[![npm](https://img.shields.io/npm/v/obscrd)](https://www.npmjs.com/package/obscrd)

## Usage

### `npx obscrd init`

Generate a cryptographic seed and write it to your `.env.local` (or `.env`):

```bash
npx obscrd init
# ✓ Generated seed: a7f3b2c8e1d9f4a6...
# ✓ Written to .env.local as OBSCRD_SEED
```

Then add it to your provider:

```tsx
import { ObscrdProvider } from '@obscrd/react'

<ObscrdProvider seed={process.env.OBSCRD_SEED}>
  {/* your app */}
</ObscrdProvider>
```

### `npx obscrd seed`

Print a random seed to stdout (useful for piping):

```bash
npx obscrd seed
```

## What is the seed?

The seed enables **deterministic obfuscation** — the same content always scrambles to the same output, ensuring consistent behavior across renders and users. It's a 32-character hex string generated from 16 random bytes.

## Packages

| Package | Description |
|---------|------------|
| [@obscrd/core](https://www.npmjs.com/package/@obscrd/core) | Content protection engine (obfuscation, honeypots, clipboard, devtools) |
| [@obscrd/react](https://www.npmjs.com/package/@obscrd/react) | React components (ProtectedText, ProtectedEmail, etc.) |
| [@obscrd/robots](https://www.npmjs.com/package/@obscrd/robots) | AI crawler blocking (robots.txt, middleware) |

## Links

- [Website](https://obscrd.dev)
- [Docs](https://obscrd.dev/docs)
- [GitHub](https://github.com/obscrd/obscrd)
- [Discord](https://discord.gg/obscrd)

## License

MIT
