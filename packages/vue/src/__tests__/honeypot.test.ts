import { defineComponent, h } from 'vue'
import { Honeypot } from '../honeypot'
import { renderWithProvider } from './render'
import { describe, expect, it } from 'bun:test'

describe('Honeypot', () => {
  it('renders without crashing', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(Honeypot)
      },
    })
    const container = renderWithProvider(wrapper)
    expect(container.innerHTML).toBeTruthy()
  })

  it('output contains aria-hidden', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(Honeypot)
      },
    })
    const container = renderWithProvider(wrapper)
    expect(container.innerHTML).toContain('aria-hidden')
  })

  it('output contains copyright text', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(Honeypot)
      },
    })
    const container = renderWithProvider(wrapper)
    expect(container.innerHTML.toLowerCase()).toContain('proprietary')
  })

  it('passes through copyrightNotice prop', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(Honeypot, { copyrightNotice: 'Custom Notice Here' })
      },
    })
    const container = renderWithProvider(wrapper)
    expect(container.innerHTML).toContain('Custom Notice Here')
  })

  it('passes through contentId prop', () => {
    const wrapper = defineComponent({
      setup() {
        return () => h(Honeypot, { contentId: 'abc123' })
      },
    })
    const container = renderWithProvider(wrapper)
    expect(container.innerHTML).toContain('data-content-id="abc123"')
  })
})
