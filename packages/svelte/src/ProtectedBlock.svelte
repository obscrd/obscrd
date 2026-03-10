<script lang="ts">
  import { createClipboardInterceptor } from '@obscrd/core'
  import { onMount, onDestroy, type Snippet } from 'svelte'

  import { getObscrd } from './context.js'

  // ── Props ──

  interface Props {
    children?: Snippet
    class?: string
  }

  let { children, class: className }: Props = $props()

  // ── Context ──

  const { config } = getObscrd()

  // ── State ──

  let el: HTMLDivElement | undefined = $state()
  let detach: (() => void) | undefined

  // ── Lifecycle ──

  onMount(() => {
    if (config.clipboard === false || !el) return
    const interceptor = createClipboardInterceptor(el)
    interceptor.attach()
    detach = () => interceptor.detach()
  })

  onDestroy(() => {
    detach?.()
  })
</script>

<div bind:this={el} class={className}>
  {@render children?.()}
</div>
