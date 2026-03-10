<script lang="ts">
  import type { Snippet } from 'svelte'

  // ── Props ──

  interface Props {
    href: string
    children?: Snippet
    class?: string
    style?: string
    obfuscate?: boolean
    onclick?: (e: MouseEvent) => void
    target?: string
    rel?: string
    id?: string
  }

  let {
    href,
    children,
    class: className,
    style,
    obfuscate = true,
    onclick,
    target,
    rel = 'noopener noreferrer',
    id,
  }: Props = $props()

  // ── State ──

  let active = $state(false)
</script>

{#if !obfuscate}
  <a {id} {href} class={className} {style} {onclick} {target} {rel}>
    {@render children?.()}
  </a>
{:else}
  <a
    {id}
    href={active ? href : '#'}
    class={className}
    style={style ? `cursor:pointer;${style}` : 'cursor:pointer'}
    {onclick}
    onmouseenter={() => (active = true)}
    onmouseleave={() => (active = false)}
    onfocus={() => (active = true)}
    onblur={() => (active = false)}
    {target}
    {rel}
  >
    {@render children?.()}
  </a>
{/if}
