import { defineComponent, h } from 'vue'
import { ProtectedEmail } from '../email'
import { renderWithProvider } from './render'
import { describe, expect, it } from 'bun:test'

describe('ProtectedEmail', () => {
  it('renders without crashing', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedEmail, { email: 'test@example.com' })
      },
    })
    const container = renderWithProvider(wrapper)
    expect(container.innerHTML).toBeTruthy()
  })

  it('renders an <a> tag', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedEmail, { email: 'test@example.com' })
      },
    })
    const container = renderWithProvider(wrapper)
    const a = container.querySelector('a')
    expect(a).toBeTruthy()
  })

  it('injects a style tag', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(ProtectedEmail, { email: 'test@example.com' })
      },
    })
    const container = renderWithProvider(wrapper)
    const style = container.querySelector('style')
    expect(style).toBeTruthy()
  })
})
