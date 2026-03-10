# Framework Adapters Design — Vue, Svelte, Angular

**Date:** 2026-03-10
**Branch:** `feat/framework-adapters`
**Status:** Approved

## Goal

Add Vue 3.4+, Svelte 5+, and Angular 17+ adapter packages that mirror the existing `@obscrd/react` API surface. Zero changes to `@obscrd/core` or `@obscrd/react`.

## Decisions

- **Single feature branch** for all three adapters
- **Consistent component names** across frameworks (`ProtectedText`, `ProtectedEmail`, etc.)
- **Framework-idiomatic wiring** for context/DI, lifecycle, and reactivity
- **tsup** for Vue and Svelte builds (matches React); **ng-packagr** for Angular (APF required)
- **Minimum versions:** Vue 3.4+, Svelte 5+, Angular 17+

## Architecture

Each adapter is a standalone package (`packages/vue`, `packages/svelte`, `packages/angular`) depending on `@obscrd/core` via `workspace:*`. No shared adapter base layer — each package owns its framework wiring and maps directly to core functions.

## Component Mapping

| Export | React | Vue | Svelte 5 | Angular 17+ |
|---|---|---|---|---|
| Provider | `<ObscrdProvider>` context | `<ObscrdProvider>` with `provide()` | `<ObscrdProvider>` with `setContext()` | `provideObscrd()` DI function + optional `<obscrd-provider>` |
| Context access | `useObscrd()` hook | `useObscrd()` composable | `getObscrd()` function | `inject(ObscrdService)` |
| Raw HTML | `dangerouslySetInnerHTML` | `v-html` | `{@html}` | `[innerHTML]` + `DomSanitizer` |
| Refs | `forwardRef` + `useRef` | template refs + `defineExpose` | `bind:this` | `viewChild()` signal |
| Memoization | `useMemo` | `computed()` | `$derived` | `computed()` signal |
| Side effects | `useEffect` | `onMounted`/`onUnmounted`/`watch` | `$effect` | `afterNextRender` + `DestroyRef` |
| State | `useState` | `ref()` | `$state` | `signal()` |

## Package-Specific Details

### `@obscrd/vue`

- Composition API only (`<script setup lang="ts">`)
- Props via `defineProps<T>()` with TypeScript generics
- `srOnly` as plain CSS string constant (no React CSSProperties)
- `useObscrd()` composable mirrors React hook naming (idiomatic in Vue 3)
- Build: tsup with `vue` as external peer dep

### `@obscrd/svelte`

- Runes: `$state`, `$derived`, `$effect`, `$props`
- `getObscrd()` for context access (Svelte doesn't use `use` prefix convention)
- Components as `.svelte` files, types exported from `.ts` files
- Build: tsup compiling `.svelte` → JS via `svelte/compiler`

### `@obscrd/angular`

- Standalone components only (no NgModule)
- `provideObscrd(config)` function for `app.config.ts` — primary API
- `ObscrdProvider` component available for template-level config overrides
- `ObscrdService` injectable manages seed, devtools detection lifecycle
- `DomSanitizer.bypassSecurityTrustHtml()` for all raw HTML
- Signals: `computed()`, `signal()`, `effect()`
- Build: ng-packagr for Angular Package Format

## File Structure (per package)

```
packages/<framework>/
├── src/
│   ├── index.ts
│   ├── provider.*
│   ├── text.*
│   ├── email.*
│   ├── phone.*
│   ├── image.*
│   ├── link.*
│   ├── block.*
│   ├── honeypot.*
│   ├── breadcrumb.*
│   └── styles.ts
├── package.json
├── tsconfig.json
└── tsup.config.ts / ng-package.json
```

## Export Surface

```typescript
// @obscrd/vue
import { ObscrdProvider, ProtectedText, ProtectedEmail, useObscrd } from '@obscrd/vue'

// @obscrd/svelte
import { ObscrdProvider, ProtectedText, ProtectedEmail, getObscrd } from '@obscrd/svelte'

// @obscrd/angular
import { provideObscrd, ProtectedText, ProtectedEmail, ObscrdService } from '@obscrd/angular'
```

## Build & Workspace

- Root `package.json` workspaces glob `packages/*` — no config change needed
- Root build script builds core first, then all other packages in parallel
- Biome overrides needed for innerHTML-equivalent patterns per framework
