# @obscrd/react

React components for content protection — obfuscate text, images, and contact info from scrapers and AI bots.

## Install

```bash
npm install @obscrd/react
```

Requires `react >= 18.0.0` and `react-dom >= 18.0.0` as peer dependencies.

## Quick Start

```tsx
import { ObscrdProvider, ProtectedText } from '@obscrd/react'

function App() {
  return (
    <ObscrdProvider seed="your-project-seed">
      <ProtectedText>This text is protected from scrapers</ProtectedText>
    </ObscrdProvider>
  )
}
```

## Components

### `<ObscrdProvider>`

Wraps your app and provides configuration to all protected components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seed` | `string` | **required** | Project seed for deterministic obfuscation |
| `level` | `'light' \| 'medium' \| 'maximum'` | `'medium'` | Protection level |
| `clipboard` | `boolean` | — | Enable clipboard interception |
| `devtools` | `boolean` | — | Enable DevTools detection |
| `honeypot` | `boolean` | — | Enable AI honeypot injection |
| `copyrightNotice` | `string` | — | Custom copyright notice for honeypots |
| `contentIdPrefix` | `string` | — | Content ID prefix for forensic tracking |

### `<ProtectedText>`

Obfuscates text content into scrambled HTML that renders correctly.

```tsx
<ProtectedText level="maximum" as="h1" className="title">
  Sensitive Heading
</ProtectedText>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Text to obfuscate |
| `level` | `'light' \| 'medium' \| 'maximum'` | provider level | Override protection level |
| `as` | `keyof HTMLElementTagNameMap` | `'span'` | HTML tag to render |
| `className` | `string` | — | CSS class |

**Levels:** `light` (word shuffle), `medium` (+ char shuffle + decoys), `maximum` (+ zero-width chars + no select)

### `<ProtectedEmail>`

Obfuscates an email address using RTL text reversal. Requires `<ObscrdProvider>` as a parent — uses the project seed for deterministic obfuscation.

```tsx
<ProtectedEmail email="user@example.com" />
<ProtectedEmail email="user@example.com">Contact us</ProtectedEmail>
```

| Prop | Type | Description |
|------|------|-------------|
| `email` | `string` | Email address to protect |
| `children` | `string` | Optional display text (used as screen-reader-only label) |
| `className` | `string` | CSS class |

### `<ProtectedPhone>`

Obfuscates a phone number using RTL text reversal. Requires `<ObscrdProvider>` as a parent.

```tsx
<ProtectedPhone phone="+1-555-123-4567" />
```

Same props as `ProtectedEmail` but with `phone` instead of `email`.

### `<ProtectedBlock>`

Wraps content and attaches clipboard interception (when `clipboard` is enabled on the provider).

```tsx
<ProtectedBlock className="article">
  <p>This content cannot be copy-pasted.</p>
</ProtectedBlock>
```

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Content to protect |
| `className` | `string` | CSS class |

### `<ProtectedImage>`

Renders an image to a `<canvas>` element — no `<img>` tag in the DOM, so scrapers can't grab the URL. Includes right-click and drag protection.

```tsx
<ProtectedImage src="/photo.jpg" alt="A photo" width={800} height={600} />
```

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | Image source URL |
| `alt` | `string` | Alt text |
| `width` | `number` | Image width |
| `height` | `number` | Image height |
| `className` | `string` | CSS class |

### `<Honeypot>`

Injects hidden copyright traps and prompt injection for AI scrapers.

```tsx
<Honeypot copyrightNotice="Acme Corp" contentId="page-123" />
```

| Prop | Type | Description |
|------|------|-------------|
| `copyrightNotice` | `string` | Custom copyright notice |
| `contentId` | `string` | Content ID for forensic tracking |

### `<Breadcrumb>`

Renders an invisible forensic breadcrumb for content tracking.

```tsx
<Breadcrumb id="article-42" />
```

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier (auto-generated if omitted) |

## Hooks

### `useObscrd()`

Access the Obscrd configuration context.

```tsx
const { config } = useObscrd()
```

### `useProtectedCopy()`

Get a clipboard prevention handler.

```tsx
const { onCopy } = useProtectedCopy()
return <div onCopy={onCopy}>Protected content</div>
```

## Accessibility

All components are WCAG 2.2 AA compliant. Contact components use visually-hidden spans to provide clean text for screen readers. Honeypots and breadcrumbs use `aria-hidden="true"` to be invisible to assistive technology.

## License

MIT
