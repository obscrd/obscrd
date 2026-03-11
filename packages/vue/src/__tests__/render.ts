import { type Component, createApp, defineComponent, h } from 'vue'
import { ObscrdProvider } from '../provider'

export function renderWithProvider(component: Component, props?: Record<string, unknown>, seed = 'test-seed') {
  const container = document.createElement('div')
  const wrapper = defineComponent({
    setup() {
      return () => h(ObscrdProvider, { seed }, () => [h(component, props)])
    },
  })
  createApp(wrapper).mount(container)
  return container
}

export function render(component: Component, props?: Record<string, unknown>) {
  const container = document.createElement('div')
  const wrapper = defineComponent({
    setup() {
      return () => h(component, props)
    },
  })
  createApp(wrapper).mount(container)
  return container
}
