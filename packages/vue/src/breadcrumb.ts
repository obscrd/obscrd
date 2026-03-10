import { deriveSeed } from '@obscrd/core'
import { computed, defineComponent, h, type PropType } from 'vue'
import { useObscrd } from './provider'
import { srOnly } from './styles'

export interface BreadcrumbProps {
  id?: string
}

export const Breadcrumb = defineComponent({
  name: 'Breadcrumb',
  props: {
    id: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const { config } = useObscrd()

    const contentId = computed(() => {
      if (props.id) return props.id
      return deriveSeed(config.seed, 'breadcrumb').slice(0, 8)
    })

    if (process.env.NODE_ENV !== 'production' && !props.id) {
      console.warn('[obscrd] Breadcrumb without an explicit `id` — generated IDs change per seed.')
    }

    return () =>
      h(
        'span',
        {
          'aria-hidden': 'true',
          'data-obscrd-breadcrumb': contentId.value,
          style: srOnly,
        },
        contentId.value,
      )
  },
})
