import { obfuscateEmail } from '@obscrd/core'
import { computed, defineComponent, h, type PropType } from 'vue'
import { ProtectedLink } from './link'
import { useObscrd } from './provider'
import { srOnly } from './styles'

// ── Helpers ──

function buildMailto(email: string, opts: { subject?: string; body?: string; cc?: string; bcc?: string }): string {
  const params = new URLSearchParams()
  if (opts.subject) params.set('subject', opts.subject)
  if (opts.body) params.set('body', opts.body)
  if (opts.cc) params.set('cc', opts.cc)
  if (opts.bcc) params.set('bcc', opts.bcc)
  const query = params.toString()
  return `mailto:${email}${query ? `?${query}` : ''}`
}

// ── Component ──

export interface ProtectedEmailProps {
  email: string
  className?: string
  subject?: string
  body?: string
  cc?: string
  bcc?: string
  obfuscate?: boolean
  id?: string
  target?: string
  rel?: string
}

export const ProtectedEmail = defineComponent({
  name: 'ProtectedEmail',
  props: {
    email: { type: String as PropType<string>, required: true },
    class: { type: String as PropType<string>, default: undefined },
    subject: { type: String as PropType<string>, default: undefined },
    body: { type: String as PropType<string>, default: undefined },
    cc: { type: String as PropType<string>, default: undefined },
    bcc: { type: String as PropType<string>, default: undefined },
    obfuscate: { type: Boolean as PropType<boolean>, default: true },
    id: { type: String as PropType<string>, default: undefined },
    target: { type: String as PropType<string>, default: undefined },
    rel: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { slots }) {
    const { config } = useObscrd()

    const result = computed(() => obfuscateEmail(props.email, config.seed))
    const href = computed(() =>
      buildMailto(props.email, {
        subject: props.subject,
        body: props.body,
        cc: props.cc,
        bcc: props.bcc,
      }),
    )

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
            h('span', { style: srOnly }, props.email),
            h('span', { 'aria-hidden': 'true', innerHTML: result.value.html }),
          ]),
        ]
      }

      return h(ProtectedLink, linkProps, () => (hasSlot ? slots.default!() : [props.email]))
    }
  },
})
