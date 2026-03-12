<p align="center">
  <img src=".github/logo.png" alt="obscrd" width="400" />
</p>

<p align="center">
  Scrambles your HTML so scrapers get garbage. Humans read it normally.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@obscrd/react"><img src="https://img.shields.io/npm/v/@obscrd/react?label=%40obscrd%2Freact" alt="npm @obscrd/react" /></a>
  <a href="https://www.npmjs.com/package/@obscrd/core"><img src="https://img.shields.io/npm/v/@obscrd/core?label=%40obscrd%2Fcore" alt="npm @obscrd/core" /></a>
  <a href="https://www.npmjs.com/package/@obscrd/robots"><img src="https://img.shields.io/npm/v/@obscrd/robots?label=%40obscrd%2Frobots" alt="npm @obscrd/robots" /></a>
</p>

```bash
npm install @obscrd/react
npx obscrd init
```

```tsx
import { ObscrdProvider, ProtectedText, ProtectedEmail } from '@obscrd/react'

<ObscrdProvider seed={process.env.OBSCRD_SEED}>
  <ProtectedText>This text is protected from scrapers</ProtectedText>
  <ProtectedEmail email="hello@example.com" />
</ObscrdProvider>
```

## Features

- Text obfuscation — CSS reorders scrambled DOM visually
- Honeypots — hidden prompt injections targeting LLM scrapers
- Clipboard — copy from protected blocks produces scrambled text
- Email/phone — RTL reversal + decoy characters, real href on interaction
- Images — canvas rendering, no `<img>` tag in DOM
- robots.txt — blocks 30+ AI crawlers
- Breadcrumbs — invisible markers to prove content theft
- WCAG 2.2 AA — screen readers unaffected, tested with VoiceOver and NVDA

Stops scrapers that read raw HTML. Does not stop headless browsers or screenshots. See [SECURITY.md](./SECURITY.md) for the full threat model.

## Packages

| Package | Description |
|---------|------------|
| [obscrd](./packages/cli) | CLI — seed generation (`npx obscrd init`) |
| [@obscrd/core](./packages/core) | Obfuscation engine, honeypots, clipboard, devtools |
| [@obscrd/react](./packages/react) | React components and hooks |
| [@obscrd/robots](./packages/robots) | robots.txt generation + server middleware |

[Docs](https://obscrd.dev/docs) · [Discord](https://discord.gg/obscrd)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © [Mosr LLC](https://larsmosr.com)
