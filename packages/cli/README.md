# obscrd

CLI for [Obscrd](https://obscrd.dev) — content protection SDK for React.

## Install

```bash
npm install -g obscrd
```

Or use directly with `npx`:

```bash
npx obscrd init
```

## Commands

### `obscrd init`

Generate a cryptographic seed and write it to your `.env.local` (or `.env`) file:

```bash
npx obscrd init
# ✓ Generated seed: a7f3b2c8e1d9f4a6...
# ✓ Written to .env.local as OBSCRD_SEED
```

Then pass it to your provider:

```tsx
import { ObscrdProvider } from '@obscrd/react'

<ObscrdProvider seed={process.env.OBSCRD_SEED}>
  {/* your app */}
</ObscrdProvider>
```

### `obscrd seed`

Print a random seed to stdout (useful for piping):

```bash
npx obscrd seed
```

## Related Packages

| Package | Description |
|---------|-------------|
| [@obscrd/core](https://www.npmjs.com/package/@obscrd/core) | Content protection engine |
| [@obscrd/react](https://www.npmjs.com/package/@obscrd/react) | React components |
| [@obscrd/robots](https://www.npmjs.com/package/@obscrd/robots) | AI crawler blocking |

## License

MIT © [Mosr LLC](https://obscrd.dev)
