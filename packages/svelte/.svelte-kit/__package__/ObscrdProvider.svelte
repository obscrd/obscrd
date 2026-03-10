<script lang="ts">
  import { createSeed, detectDevTools, generateHoneypot, type ObscrdConfig } from '@obscrd/core'
  import { onMount, onDestroy, type Snippet } from 'svelte'

  import { setObscrd } from './context.js'

  // ── Props ──

  interface Props {
    children?: Snippet
    seed?: string
    level?: ObscrdConfig['level']
    clipboard?: boolean
    devtools?: boolean
    honeypot?: boolean
    copyrightNotice?: string
    contentIdPrefix?: string
    onDevToolsDetected?: () => void
  }

  let {
    children,
    seed,
    level = 'medium',
    clipboard,
    devtools,
    honeypot,
    copyrightNotice,
    contentIdPrefix,
    onDevToolsDetected,
  }: Props = $props()

  // ── State ──

  let mounted = $state(false)
  const fallbackSeed = createSeed()
  const resolvedSeed = $derived(seed ?? fallbackSeed)

  const config = $derived<ObscrdConfig>({
    seed: resolvedSeed,
    level,
    clipboard,
    devtools,
    honeypot,
    copyrightNotice,
    contentIdPrefix,
  })

  const honeypotHtml = $derived(
    honeypot ? generateHoneypot({ copyrightNotice, seed: resolvedSeed }) : '',
  )

  // ── Context ──

  setObscrd({ get config() { return config } })

  // ── Lifecycle ──

  let detectorStop: (() => void) | undefined

  onMount(() => {
    if (!seed) {
      console.warn(
        '[obscrd] No seed provided — using a random seed. For deterministic obfuscation and SSR support, run: npx @obscrd/core init',
      )
    }
    mounted = true

    if (devtools) {
      const detector = detectDevTools(onDevToolsDetected ?? (() => console.warn('[obscrd] DevTools detected')))
      detector.start()
      detectorStop = () => detector.stop()
    }
  })

  onDestroy(() => {
    detectorStop?.()
  })
</script>

{#if seed || mounted}
  {@render children?.()}
  {#if honeypot}
    {@html honeypotHtml}
  {/if}
{:else}
  {@render children?.()}
{/if}
