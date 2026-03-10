<script lang="ts">
  import { obfuscateText } from '@obscrd/core'

  import { getObscrd } from './context.js'

  // ── Props ──

  type TextElement =
    | 'span' | 'p' | 'div'
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    | 'li' | 'td' | 'th' | 'label' | 'legend' | 'caption'
    | 'blockquote' | 'figcaption' | 'strong' | 'em' | 'small'
    | 'mark' | 'cite' | 'abbr' | 'time' | 'address' | 'dt' | 'dd'

  interface Props {
    text: string
    level?: 'light' | 'medium' | 'maximum'
    as?: TextElement
    class?: string
    obfuscate?: boolean
    id?: string
  }

  let {
    text,
    level,
    as = 'span',
    class: className,
    obfuscate = true,
    id,
  }: Props = $props()

  // ── Context ──

  const { config } = getObscrd()

  // ── Derived ──

  const effectiveLevel = $derived(level ?? config.level ?? 'medium')
  const result = $derived(obfuscateText(text, { seed: config.seed, level: effectiveLevel }))
</script>

{#if !obfuscate}
  <svelte:element this={as} {id} class={className}>{text}</svelte:element>
{:else}
  {@html `<style>${result.css}</style>`}
  <svelte:element this={as} {id} class={className}>
    {@html result.html}
  </svelte:element>
{/if}
