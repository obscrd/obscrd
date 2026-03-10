import { createClipboardInterceptor } from '@obscrd/core'
import { defineComponent, h, onMounted, onUnmounted, type PropType, ref, watch } from 'vue'
import { useObscrd } from './provider'

// ── Types ──

export interface ProtectedBlockProps {
  class?: string
}

// ── Component ──

export const ProtectedBlock = defineComponent({
  name: 'ProtectedBlock',
  props: {
    class: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    const { config } = useObscrd()
    const blockRef = ref<HTMLDivElement | null>(null)
    let detach: (() => void) | undefined

    const attachInterceptor = () => {
      detach?.()
      detach = undefined
      if (config.clipboard === false) return
      if (!blockRef.value) return
      const interceptor = createClipboardInterceptor(blockRef.value)
      interceptor.attach()
      detach = () => interceptor.detach()
    }

    onMounted(attachInterceptor)

    watch(() => config.clipboard, attachInterceptor)

    onUnmounted(() => {
      detach?.()
    })

    return () => h('div', { ref: blockRef, class: props.class }, slots.default?.())
  },
})
