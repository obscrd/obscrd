# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Development (starts all apps)
bun run dev

# Run demo app
bun run dev:demo

# Lint and format (uses Biome)
bun run lint
bun run lint:fix
bun run format

# Type checking
bun run typecheck

# Clean build artifacts
bun run clean
```

## Architecture

**Bun-based monorepo** for obscrd's NPM packages — content protection SDK for React.

### Workspace Structure

- `packages/core` - `@obscrd/core` — Content protection engine (obfuscation, honeypots, clipboard, devtools)
- `packages/react` - `@obscrd/react` — React components (ProtectedText, ProtectedEmail, etc.)
- `packages/robots` - `@obscrd/robots` — AI crawler blocking (robots.txt, middleware)
- `packages/typescript-config` - `@obscrd/typescript-config` — Shared TypeScript configs
- `apps/demo` - Demo app (placeholder)

### Key Technologies

- **Package Manager**: Bun v1.2.0
- **Build**: tsup (ESM + CJS + DTS)
- **Language**: TypeScript 5.8+ (strict mode)
- **Linting/Formatting**: Biome (no ESLint/Prettier)

### Package Exports

Each package exports ESM + CJS with full TypeScript declarations:

```typescript
import { obfuscateText, createSeed, generateHoneypot } from '@obscrd/core'
import { ObscrdProvider, ProtectedText, ProtectedEmail } from '@obscrd/react'
import { generateRobotsTxt, AI_CRAWLERS } from '@obscrd/robots'
```

## Code Style (Biome)

- Single quotes, semicolons as needed, trailing commas
- 120 character line width, 2-space indentation
- Import groups: Node → Packages → @/** aliases → Relative paths

### Comments

- Keep comments minimal — only add them when they provide genuine value
- Use short section dividers to separate logical blocks (e.g. `// ── Types ──`, `// ── Root ──`)
- Use brief inline hints that explain *why* or *what region* something is, not *what the code does*
- Never add doc comments, JSDoc, or type annotations to code you didn't write
- TODO comments are acceptable for unimplemented placeholders, but avoid them in completed code

## Git

### Pre-commit Hooks

Husky + lint-staged auto-formats staged files on commit using Biome.
- Runs `biome check --write` on `*.{js,ts,jsx,tsx,json,css}`
- Blocks commit if there are unfixable errors

### Semantic Commit Messages
See how a minor change to your commit message style can make you a better programmer.

Format: <type>(<scope>): <subject>

<scope> is optional

Examples:
feat: (new feature for the user, not a new feature for build script)
fix: (bug fix for the user, not a fix to a build script)
docs: (changes to the documentation)
style: (formatting, missing semi colons, etc; no production code change)
refactor: (refactoring production code, eg. renaming a variable)
test: (adding missing tests, refactoring tests; no production code change)
chore: (updating grunt tasks etc; no production code change)

Never add anything like/similar to Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
