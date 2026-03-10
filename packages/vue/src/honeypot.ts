import { generateHoneypot } from '@obscrd/core'
import { computed, defineComponent, h, type PropType } from 'vue'
import { useObscrd } from './provider'

export interface HoneypotProps {
  copyrightNotice?: string
  contentId?: string
}

export const Honeypot = defineComponent({
  name: 'Honeypot',
  props: {
    copyrightNotice: { type: String as PropType<string>, default: undefined },
    contentId: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const { config } = useObscrd()

    const html = computed(() =>
      generateHoneypot({
        contentId: props.contentId,
        copyrightNotice: props.copyrightNotice ?? config.copyrightNotice,
        seed: config.seed,
      }),
    )

    return () => h('div', { innerHTML: html.value })
  },
})
