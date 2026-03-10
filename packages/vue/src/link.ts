import { defineComponent, h, type PropType, ref } from 'vue'

export interface ProtectedLinkProps {
  href: string
  className?: string
  obfuscate?: boolean
  target?: string
  rel?: string
  id?: string
}

export const ProtectedLink = defineComponent({
  name: 'ProtectedLink',
  props: {
    href: { type: String as PropType<string>, required: true },
    class: { type: String as PropType<string>, default: undefined },
    obfuscate: { type: Boolean as PropType<boolean>, default: true },
    target: { type: String as PropType<string>, default: undefined },
    rel: { type: String as PropType<string>, default: 'noopener noreferrer' },
    id: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    const active = ref(false)

    return () => {
      if (!props.obfuscate) {
        return h(
          'a',
          {
            id: props.id,
            href: props.href,
            class: props.class,
            target: props.target,
            rel: props.rel,
          },
          slots.default?.(),
        )
      }

      return h(
        'a',
        {
          id: props.id,
          href: active.value ? props.href : '#',
          class: props.class,
          style: { cursor: 'pointer' },
          target: props.target,
          rel: props.rel,
          onMouseenter: () => {
            active.value = true
          },
          onMouseleave: () => {
            active.value = false
          },
          onFocus: () => {
            active.value = true
          },
          onBlur: () => {
            active.value = false
          },
        },
        slots.default?.(),
      )
    }
  },
})
