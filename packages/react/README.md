# @obscrd/react

React components for content protection — obfuscate text, images, and contact info from scrapers and AI bots.

## Install

```bash
npm install @obscrd/react
```

Requires `react >= 18.0.0` and `react-dom >= 18.0.0` as peer dependencies.

## Quick Start

Generate a project seed:

```bash
npx obscrd init
```

Then use it in your app:

```tsx
import { ObscrdProvider, ProtectedText } from '@obscrd/react'

function App() {
  return (
    <ObscrdProvider seed={process.env.OBSCRD_SEED}>
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
| `seed` | `string` | random | Project seed for deterministic obfuscation |
| `level` | `'light' \| 'medium' \| 'maximum'` | `'medium'` | Protection level |
| `clipboard` | `boolean` | — | Enable clipboard interception |
| `devtools` | `boolean` | — | Enable DevTools detection (auto-starts detector) |
| `honeypot` | `boolean` | — | Auto-inject AI honeypot at provider level |
| `copyrightNotice` | `string` | — | Custom copyright notice for honeypots |
| `contentIdPrefix` | `string` | — | Content ID prefix for forensic tracking |
| `onDevToolsDetected` | `() => void` | `console.warn` | Callback when DevTools are detected |

When `devtools` is enabled, the provider automatically starts a DevTools detector and calls `onDevToolsDetected` (or logs a warning) when detected. When `honeypot` is enabled, the provider auto-injects a honeypot element — no need to manually place a `<Honeypot>` component.

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
| `obfuscate` | `boolean` | `true` | Disable obfuscation (useful for debugging) |

**Levels:** `light` (word shuffle), `medium` (+ char shuffle + decoys), `maximum` (+ zero-width chars + no select)

### `<ProtectedEmail>`

Renders a clickable `<a>` tag that reveals a `mailto:` href on interaction. The email is obfuscated using RTL text reversal — bots see `href="#"` in static HTML, while humans get the real link on hover/focus.

```tsx
<ProtectedEmail email="user@example.com" />
<ProtectedEmail email="user@example.com" subject="Hello" body="Hi there">
  Contact us
</ProtectedEmail>
```

| Prop | Type | Description |
|------|------|-------------|
| `email` | `string` | Email address to protect |
| `children` | `ReactNode` | Optional display text or React elements (icons, buttons) |
| `className` | `string` | CSS class |
| `subject` | `string` | Email subject line |
| `body` | `string` | Email body text |
| `cc` | `string` | CC recipients (comma-separated) |
| `bcc` | `string` | BCC recipients (comma-separated) |
| `onClick` | `MouseEventHandler` | Additional click handler |

### `<ProtectedPhone>`

Renders a clickable `<a>` tag that reveals a `tel:` (or `sms:`) href on interaction. The phone number is obfuscated using RTL text reversal.

```tsx
<ProtectedPhone phone="+1-555-123-4567" />
<ProtectedPhone phone="+1-555-123-4567" sms>Text us</ProtectedPhone>
```

| Prop | Type | Description |
|------|------|-------------|
| `phone` | `string` | Phone number to protect |
| `children` | `ReactNode` | Optional display text or React elements (icons, buttons) |
| `className` | `string` | CSS class |
| `sms` | `boolean` | Use `sms:` instead of `tel:` |
| `onClick` | `MouseEventHandler` | Additional click handler |

### `<ProtectedLink>`

Generic obfuscated link — hides the `href` until user interaction. Works with any URL scheme (`mailto:`, `tel:`, `https:`, etc.). Use it directly for arbitrary links, or let `ProtectedEmail` / `ProtectedPhone` handle contact-specific obfuscation.

```tsx
<ProtectedLink href="https://wa.me/15551234567">Chat on WhatsApp</ProtectedLink>

<ProtectedLink href="https://secret.example.com/invite">
  <ProtectedText>Secret invite link</ProtectedText>
</ProtectedLink>

<ProtectedLink href="https://example.com" obfuscate={false}>
  Debugging — real href visible immediately
</ProtectedLink>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | **required** | URL to protect |
| `children` | `ReactNode` | **required** | Display content |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `obfuscate` | `boolean` | `true` | Disable obfuscation for debugging |
| `onClick` | `MouseEventHandler` | — | Click handler |
| `target` | `string` | — | Link target |
| `rel` | `string` | `'noopener noreferrer'` | Rel attribute |

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

Renders an image to a `<canvas>` element — no `<img>` tag in the DOM, so scrapers can't grab the URL. Includes right-click and drag protection. Shows an error fallback with the alt text when the image fails to load.

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
