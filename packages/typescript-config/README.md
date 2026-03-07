# TypeScript Config

Shared TypeScript configurations extended by all workspaces.

## Configs

| File | Extends | Use Case |
|------|---------|----------|
| `base.json` | - | Strict base config (all workspaces) |
| `base.app.json` | `base.json` | React/browser apps (includes DOM libs, JSX) |
| `base.node.json` | `base.json` | Node.js/server packages |
| `library.json` | `base.json` | Publishable library packages |

## Key Settings

All configs enforce strict TypeScript:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `isolatedModules: true`
- Module resolution: `bundler`

## Usage

In a workspace `tsconfig.json`:

```json
{
  "extends": "typescript-config/base.app.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
