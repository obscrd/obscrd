<script lang="ts">
  import { obfuscatePhone } from '@obscrd/core'
  import type { Snippet } from 'svelte'

  import { getObscrd } from './context.js'
  import ProtectedLink from './ProtectedLink.svelte'
  import { srOnly } from './styles.js'

  // ── Props ──

  interface Props {
    phone: string
    label?: string
    class?: string
    style?: string
    sms?: boolean
    onclick?: (e: MouseEvent) => void
    obfuscate?: boolean
    id?: string
    target?: string
    rel?: string
    children?: Snippet
  }

  let {
    phone,
    label,
    class: className,
    style,
    sms,
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

  const result = $derived(obfuscatePhone(phone, config.seed))
  const href = $derived(sms ? `sms:${phone}` : `tel:${phone}`)
  const displayText = $derived(label ?? phone)
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
