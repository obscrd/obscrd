import { createSeed, detectDevTools, generateHoneypot, type ObscrdConfig } from '@obscrd/core'
import {
  type ComputedRef,
  computed,
  defineComponent,
  h,
  type InjectionKey,
  inject,
  onMounted,
  onUnmounted,
  type PropType,
  provide,
  ref,
} from 'vue'

// ── Types ──

export interface ObscrdContextValue {
  config: ObscrdConfig
}

export interface ObscrdProviderProps {
  seed?: string
  level?: ObscrdConfig['level']
  clipboard?: boolean
  devtools?: boolean
  honeypot?: boolean
  copyrightNotice?: string
  contentIdPrefix?: string
  onDevToolsDetected?: () => void
}

interface ObscrdReactiveContext {
  config: ComputedRef<ObscrdConfig>
}

const obscrdKey: InjectionKey<ObscrdReactiveContext> = Symbol('obscrd')

// ── Provider ──

export const ObscrdProvider = defineComponent({
  name: 'ObscrdProvider',
  props: {
    seed: { type: String as PropType<string>, default: undefined },
    level: { type: String as PropType<ObscrdConfig['level']>, default: 'medium' },
    clipboard: { type: Boolean as PropType<boolean>, default: undefined },
    devtools: { type: Boolean as PropType<boolean>, default: undefined },
    honeypot: { type: Boolean as PropType<boolean>, default: undefined },
    copyrightNotice: { type: String as PropType<string>, default: undefined },
    contentIdPrefix: { type: String as PropType<string>, default: undefined },
    onDevToolsDetected: { type: Function as PropType<() => void>, default: undefined },
  },
  setup(props, { slots }) {
    const mounted = ref(false)
    const fallbackSeed = createSeed()
    const resolvedSeed = computed(() => props.seed ?? fallbackSeed)

    onMounted(() => {
      if (!props.seed) {
        console.warn(
          '[obscrd] No seed provided — using a random seed. For deterministic obfuscation and SSR support, run: npx @obscrd/core init',
        )
        mounted.value = true
      }
    })

    // ── DevTools detection ──
    let stopDetector: (() => void) | undefined

    const startDetector = () => {
      stopDetector?.()
      if (!props.devtools) return
      const detector = detectDevTools(props.onDevToolsDetected ?? (() => console.warn('[obscrd] DevTools detected')))
      detector.start()
      stopDetector = () => detector.stop()
    }

    onMounted(startDetector)
    onUnmounted(() => stopDetector?.())

    const config = computed<ObscrdConfig>(() => ({
      seed: resolvedSeed.value,
      level: props.level,
      clipboard: props.clipboard,
      devtools: props.devtools,
      honeypot: props.honeypot,
      copyrightNotice: props.copyrightNotice,
      contentIdPrefix: props.contentIdPrefix,
    }))

    const honeypotHtml = computed(() =>
      props.honeypot ? generateHoneypot({ copyrightNotice: props.copyrightNotice, seed: resolvedSeed.value }) : '',
    )

    // Provide computed ref directly so descendants get reactive updates
    provide(obscrdKey, { config })

    return () => {
      const children = slots.default?.()

      // SSR safety: render children without context until mounted
      if (!props.seed && !mounted.value) {
        return children
      }

      if (props.honeypot) {
        return [children, h('div', { innerHTML: honeypotHtml.value })]
      }

      return children
    }
  },
})

// ── Composable ──

export function useObscrd(): { config: ComputedRef<ObscrdConfig> } {
  const context = inject(obscrdKey)
  if (!context) {
    throw new Error('useObscrd() must be used within an <ObscrdProvider>')
  }
  return context
}
