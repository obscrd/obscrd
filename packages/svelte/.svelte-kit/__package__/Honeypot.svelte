<script lang="ts">
  import { generateHoneypot } from '@obscrd/core'

  import { getObscrd } from './context.js'

  // ── Props ──

  interface Props {
    copyrightNotice?: string
    contentId?: string
  }

  let { copyrightNotice, contentId }: Props = $props()

  // ── Context ──

  const { config } = getObscrd()

  // ── Derived ──

  const html = $derived(
    generateHoneypot({
      contentId,
      copyrightNotice: copyrightNotice ?? config.copyrightNotice,
      seed: config.seed,
    }),
  )
</script>

{@html html}
