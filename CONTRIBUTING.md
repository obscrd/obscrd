# Contributing to obscrd

## Getting Started

```bash
git clone https://github.com/obscrd/obscrd.git
cd obscrd
bun install
bun run build
bun run test
```

Requires Bun v1.2.0+.

## Development Workflow

1. Create a branch from `main`.
2. Make your changes.
3. Run checks before committing:

```bash
bun run lint        # Check for lint/format issues
bun run typecheck   # Type-check all packages
bun run test        # Run all tests
```

4. Commit, push, and open a pull request.

## Project Structure

This is a Bun-based monorepo with three packages:

| Package | Path | Description |
|---------|------|-------------|
| `@obscrd/core` | `packages/core` | Content protection engine (obfuscation, honeypots, clipboard, devtools) |
| `@obscrd/react` | `packages/react` | React components (`ObscrdProvider`, `ProtectedText`, `ProtectedEmail`) |
| `@obscrd/robots` | `packages/robots` | AI crawler blocking (robots.txt generation, middleware) |

## Code Style

Biome handles all formatting and linting. Do not configure ESLint or Prettier.

- Single quotes, semicolons as needed, trailing commas
- 120 character line width, 2-space indentation
- Keep comments minimal — explain *why*, not *what*
- Use short section dividers for logical blocks: `// ── Section ──`

## Commit Messages

Use semantic commit messages:

```
<type>(<optional scope>): <subject>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

```
feat(core): add Unicode normalization to obfuscation engine
fix(react): prevent flash of unprotected content on hydration
test(robots): add middleware tests for Cloudflare Workers
chore: update tsup build config
```

## Pre-commit Hooks

Husky + lint-staged runs automatically on commit. It applies `biome check --write` to staged files. If Biome finds unfixable errors, the commit is blocked — fix the issues and try again.

## Testing

Tests live alongside source files and use `bun:test`:

```typescript
import { describe, expect, test } from 'bun:test'
```

Run all tests:

```bash
bun run test
```

Run a specific test file:

```bash
bun test packages/core/src/obfuscate.test.ts
```

Every new feature or behavior change needs test coverage.

## Pull Requests

- Keep PRs focused on a single change.
- Include a clear description of what changed and why.
- Add or update tests for any new functionality.
- Make sure `bun run lint`, `bun run typecheck`, and `bun run test` all pass.

## Reporting Bugs

Open a GitHub issue with:

- What you expected to happen
- What actually happened
- Steps to reproduce
- obscrd version and runtime (Bun/Node)

## Security Vulnerabilities

Do not open public issues for security vulnerabilities. Email [security@obscrd.dev](mailto:security@obscrd.dev) instead. See `SECURITY.md` for details.
