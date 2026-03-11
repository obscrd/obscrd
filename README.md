<p align="center">
  <img src=".github/logo.png" alt="Obscrd" width="400" />
</p>

<p align="center">
  <strong>Your content, obscured.</strong>
</p>

<p align="center">
  Protect your website content from scrapers, AI bots, and data theft.<br/>
  Developer-first SDK for React.
</p>

<p align="center">
  <a href="https://obscrd.dev">Website</a> ·
  <a href="https://obscrd.dev/docs">Docs</a> ·
  <a href="https://discord.gg/obscrd">Discord</a>
</p>

---

## Packages

| Package | Description | NPM |
|---------|------------|-----|
| [@obscrd/core](./packages/core) | Content protection engine | [![npm](https://img.shields.io/npm/v/@obscrd/core)](https://www.npmjs.com/package/@obscrd/core) |
| [@obscrd/react](./packages/react) | React components | [![npm](https://img.shields.io/npm/v/@obscrd/react)](https://www.npmjs.com/package/@obscrd/react) |
| [@obscrd/robots](./packages/robots) | AI crawler blocking | [![npm](https://img.shields.io/npm/v/@obscrd/robots)](https://www.npmjs.com/package/@obscrd/robots) |

## Quick Start

```bash
npm install @obscrd/react
npx obscrd init
```

```tsx
import { ObscrdProvider, ProtectedText, ProtectedEmail } from '@obscrd/react'

function App() {
  return (
    <ObscrdProvider seed={process.env.OBSCRD_SEED}>
      <ProtectedText>
        This text is readable by humans but scrambled for scrapers.
      </ProtectedText>
      <ProtectedEmail email="hello@example.com" />
    </ObscrdProvider>
  )
}
```

## What It Does

- **Text obfuscation** — Scrambles HTML while CSS makes it look normal
- **AI honeypots** — Hidden text that talks directly to LLM scrapers
- **Clipboard protection** — Copy produces scrambled output
- **Contact info protection** — Emails, phones, addresses hidden from bots
- **Image protection** — Canvas-based rendering, no direct URLs
- **robots.txt automation** — Block 30+ AI crawlers with one function
- **Forensic breadcrumbs** — Prove someone stole your content
- **Accessible** — WCAG 2.2 AA compliant. All components render visually-hidden text for screen readers with `aria-hidden` on obfuscated content. Optional `hardened` and `maximum` accessibility modes randomize the a11y DOM structure to resist scraper exploitation

## Threat Model

Obscrd protects against the most common content scraping vectors:

**What it defends against:**
- HTML scrapers reading `textContent` or `innerHTML`
- AI training crawlers (GPTBot, ClaudeBot, CCBot, etc.)
- Simple bots that parse raw HTML for emails, phones, and addresses
- Casual copy-paste theft
- Right-click image saving (canvas rendering serves pixels, not URLs)
- LLM systems ingesting page content (via honeypot prompt injection)

**What it does NOT defend against:**
- Headless browsers that execute CSS and read the visually-rendered result
- Screenshot-based scraping (OCR)
- Determined attackers who reverse-engineer the obfuscation technique
- Browser extensions with page access

Obscrd raises the cost of scraping significantly. It is not DRM — no client-side solution can be.
The goal is to make your content harder to steal than your competitors' content.

For a detailed security analysis including cryptographic properties, bypass vectors,
and recommendations for higher security, see [SECURITY.md](./SECURITY.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT © [Mosr LLC](https://larsmosr.com)
