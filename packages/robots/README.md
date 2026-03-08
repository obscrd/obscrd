# @obscrd/robots

AI crawler blocking — generate `robots.txt` and serve it via middleware for Express, Fastify, or Node.js.

## Install

```bash
npm install @obscrd/robots
```

## Quick Start

```ts
import { generateRobotsTxt } from '@obscrd/robots'

const robotsTxt = generateRobotsTxt()
// Blocks all 20 known AI crawlers while allowing Googlebot and Bingbot
```

## API

### `generateRobotsTxt(options?)`

Generate a `robots.txt` string that blocks AI crawlers.

```ts
const txt = generateRobotsTxt({
  blockAll: true,        // default — block all known AI crawlers
  allow: ['ClaudeBot'],  // allow specific crawlers
  sitemap: 'https://example.com/sitemap.xml',
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `blockAll` | `boolean` | `true` | Block all known AI crawlers |
| `block` | `string[]` | — | Specific crawlers to block (overrides `blockAll`) |
| `allow` | `string[]` | — | Specific crawlers to allow |
| `customRules` | `string` | — | Additional rules to append |
| `sitemap` | `string` | — | Sitemap URL |

### `createMiddleware(options?)`

Create middleware that serves `robots.txt` at `/robots.txt`. Works with Express, Fastify, and Node's `http` module.

**Express:**

```ts
import express from 'express'
import { createMiddleware } from '@obscrd/robots'

const app = express()
app.use(createMiddleware())
```

**Node.js http:**

```ts
import { createServer } from 'node:http'
import { createMiddleware } from '@obscrd/robots'

const middleware = createMiddleware({ sitemap: 'https://example.com/sitemap.xml' })

createServer((req, res) => {
  middleware(req, res, () => {
    res.writeHead(200)
    res.end('Hello')
  })
}).listen(3000)
```

### `AI_CRAWLERS`

Exported list of 20 known AI crawler definitions.

```ts
import { AI_CRAWLERS } from '@obscrd/robots'

console.log(AI_CRAWLERS.length) // 20
// Each: { name, userAgent, operator, purpose }
// purpose: 'training' | 'search' | 'assistant'
```

Includes GPTBot, ChatGPT-User, ClaudeBot, Google-Extended, CCBot, PerplexityBot, Bytespider, Meta-ExternalAgent, and more.

## License

MIT
