import { obfuscatePhone } from '@obscrd/core'
import { computed, defineComponent, h, type PropType } from 'vue'
import { ProtectedLink } from './link'
import { useObscrd } from './provider'
import { srOnly } from './styles'

export interface ProtectedPhoneProps {
  phone: string
  className?: string
  sms?: boolean
  obfuscate?: boolean
  id?: string
  target?: string
  rel?: string
}

export const ProtectedPhone = defineComponent({
  name: 'ProtectedPhone',
  props: {
    phone: { type: String as PropType<string>, required: true },
    class: { type: String as PropType<string>, default: undefined },
    sms: { type: Boolean as PropType<boolean>, default: false },
    obfuscate: { type: Boolean as PropType<boolean>, default: true },
    id: { type: String as PropType<string>, default: undefined },
    target: { type: String as PropType<string>, default: undefined },
    rel: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    const { config } = useObscrd()

    const result = computed(() => obfuscatePhone(props.phone, config.seed))
    const href = computed(() => (props.sms ? `sms:${props.phone}` : `tel:${props.phone}`))

    return () => {
      const hasSlot = !!slots.default
      const isTextChild = !hasSlot

      const linkProps = {
        id: props.id,
        href: href.value,
        class: props.class,
        obfuscate: props.obfuscate,
        target: props.target,
        rel: props.rel,
      }

      if (props.obfuscate && isTextChild) {
        return [
          h('style', { innerHTML: result.value.css }),
          h(ProtectedLink, linkProps, () => [
            h('span', { style: srOnly }, props.phone),
            h('span', { 'aria-hidden': 'true', innerHTML: result.value.html }),
          ]),
        ]
      }

      return h(ProtectedLink, linkProps, () => (hasSlot ? slots.default!() : [props.phone]))
    }
  },
})
