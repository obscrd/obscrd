<script lang="ts">
  import { deriveSeed } from '@obscrd/core'

  import { getObscrd } from './context.js'
  import { srOnly } from './styles.js'

  // ── Props ──

  interface Props {
    id?: string
  }

  let { id }: Props = $props()

  // ── Context ──

  const { config } = getObscrd()

  // ── Derived ──

  const contentId = $derived(id ?? deriveSeed(config.seed, 'breadcrumb').slice(0, 8))
</script>

<span aria-hidden="true" data-obscrd-breadcrumb={contentId} style={srOnly}>
  {contentId}
</span>
