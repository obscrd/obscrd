import { defineComponent, h } from 'vue'
import { ProtectedText } from '../text'
import { renderWithProvider } from './render'
import { describe, expect, it } from 'bun:test'

describe('ProtectedText', () => {
  it('renders without crashing', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedText, null, () => ['Hello world'])
      },
    })
    const container = renderWithProvider(wrapper)
    expect(container.innerHTML).toBeTruthy()
  })

  it('output contains shuffled spans with data-o attributes', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedText, null, () => ['Hello world'])
      },
    })
    const container = renderWithProvider(wrapper)
    const spans = container.querySelectorAll('[data-o]')
    expect(spans.length).toBeGreaterThan(0)
  })

  it('injects a style tag with obscrd class', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedText, null, () => ['Hello world'])
      },
    })
    const container = renderWithProvider(wrapper)
    const style = container.querySelector('style')
    expect(style).toBeTruthy()
    expect(style!.innerHTML).toContain('obscrd')
  })

  it('respects level prop override — maximum has user-select:none', () => {
    const light = defineComponent({
      setup() {
        return () => h(ProtectedText, { level: 'light' }, () => ['Hello'])
      },
    })
    const maximum = defineComponent({
      setup() {
        return () => h(ProtectedText, { level: 'maximum' }, () => ['Hello'])
      },
    })
    const lightContainer = renderWithProvider(light)
    const maxContainer = renderWithProvider(maximum)

    const lightStyle = lightContainer.querySelector('style')
    const maxStyle = maxContainer.querySelector('style')

    expect(maxStyle!.innerHTML).toContain('user-select')
    // light level should not include user-select:none
    expect(lightStyle!.innerHTML).not.toContain('user-select:none')
  })

  it('respects as prop — renders correct element tag', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedText, { as: 'p' }, () => ['Hello'])
      },
    })
    const container = renderWithProvider(wrapper)
    const p = container.querySelector('p')
    expect(p).toBeTruthy()
  })

  it('applies className via class prop', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedText, { class: 'my-class' }, () => ['Hello'])
      },
    })
    const container = renderWithProvider(wrapper)
    const el = container.querySelector('.my-class')
    expect(el).toBeTruthy()
  })
})
