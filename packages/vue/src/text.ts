import { obfuscateText } from '@obscrd/core'
import { computed, defineComponent, h, type PropType } from 'vue'
import { useObscrd } from './provider'

type TextElement =
  | 'span'
  | 'p'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'li'
  | 'td'
  | 'th'
  | 'label'
  | 'legend'
  | 'caption'
  | 'blockquote'
  | 'figcaption'
  | 'strong'
  | 'em'
  | 'small'
  | 'mark'
  | 'cite'
  | 'abbr'
  | 'time'
  | 'address'
  | 'dt'
  | 'dd'

export interface ProtectedTextProps {
  children?: string
  level?: 'light' | 'medium' | 'maximum'
  as?: TextElement
  className?: string
  obfuscate?: boolean
  id?: string
}

export const ProtectedText = defineComponent({
  name: 'ProtectedText',
  props: {
    level: { type: String as PropType<'light' | 'medium' | 'maximum'>, default: undefined },
    as: { type: String as PropType<TextElement>, default: 'span' },
    class: { type: String as PropType<string>, default: undefined },
    obfuscate: { type: Boolean as PropType<boolean>, default: true },
    id: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    const { config } = useObscrd()

    const text = computed(() => {
      const children = slots.default?.()
      if (!children || children.length === 0) return ''
      const first = children[0]
      if (typeof first.children === 'string') return first.children
      return String(first.children ?? '')
    })

    const effectiveLevel = computed(() => props.level ?? config.level ?? 'medium')

    const result = computed(() => obfuscateText(text.value, { seed: config.seed, level: effectiveLevel.value }))

    return () => {
      if (!props.obfuscate) {
        return h(props.as, { id: props.id, class: props.class }, slots.default?.())
      }

      if (process.env.NODE_ENV !== 'production') {
        const children = slots.default?.()
        if (children && children.length > 0) {
          const first = children[0]
          if (typeof first.children !== 'string') {
            console.warn('[obscrd] ProtectedText received non-string children — only plain text is obfuscated.')
          }
        }
      }

      return [
        h('style', { innerHTML: result.value.css }),
        h(props.as, { id: props.id, class: props.class, innerHTML: result.value.html }),
      ]
    }
  },
})
