<script lang="ts">
  import { obfuscateEmail } from '@obscrd/core'
  import type { Snippet } from 'svelte'

  import { getObscrd } from './context.js'
  import ProtectedLink from './ProtectedLink.svelte'
  import { srOnly } from './styles.js'

  // ── Helpers ──

  function buildMailto(
    email: string,
    opts: { subject?: string; body?: string; cc?: string; bcc?: string },
  ): string {
    const params = new URLSearchParams()
    if (opts.subject) params.set('subject', opts.subject)
    if (opts.body) params.set('body', opts.body)
    if (opts.cc) params.set('cc', opts.cc)
    if (opts.bcc) params.set('bcc', opts.bcc)
    const query = params.toString()
    return `mailto:${email}${query ? `?${query}` : ''}`
  }

  // ── Props ──

  interface Props {
    email: string
    label?: string
    class?: string
    style?: string
    subject?: string
    body?: string
    cc?: string
    bcc?: string
    onclick?: (e: MouseEvent) => void
    obfuscate?: boolean
    id?: string
    target?: string
    rel?: string
    children?: Snippet
  }

  let {
    email,
    label,
    class: className,
    style,
    subject,
    body,
    cc,
    bcc,
    onclick,
    obfuscate = true,
    id,
    target,
    rel,
    children,
  }: Props = $props()

  // ── Context ──

  const { config } = getObscrd()

  // ── Derived ──

  const result = $derived(obfuscateEmail(email, config.seed))
  const href = $derived(buildMailto(email, { subject, body, cc, bcc }))
  const displayText = $derived(label ?? email)
</script>

{#if obfuscate}
  {@html `<style>${result.css}</style>`}
{/if}
<ProtectedLink {id} {href} class={className} {style} {onclick} {obfuscate} {target} {rel}>
  {#if children}
    {@render children()}
  {:else if obfuscate}
    <span style={srOnly}>{displayText}</span>
    <span aria-hidden="true">{@html result.html}</span>
  {:else}
    {displayText}
  {/if}
</ProtectedLink>
