import { createElement } from 'react'
import { Honeypot } from '../honeypot'
import { renderWithProvider } from './render'
import { describe, expect, test } from 'bun:test'

describe('Honeypot', () => {
  test('renders without crashing', () => {
    const container = renderWithProvider(createElement(Honeypot))
    expect(container.innerHTML).toBeTruthy()
  })

  test('output contains aria-hidden', () => {
    const container = renderWithProvider(createElement(Honeypot))
    const hidden = container.querySelector('[aria-hidden="true"]')
    expect(hidden).not.toBeNull()
  })

  test('output contains copyright text', () => {
    const container = renderWithProvider(createElement(Honeypot))
    expect(container.textContent).toContain('proprietary')
  })

  test('passes through copyrightNotice prop', () => {
    const container = renderWithProvider(createElement(Honeypot, { copyrightNotice: 'Acme Corp' }))
    expect(container.textContent).toContain('Acme Corp')
  })

  test('passes through contentId prop', () => {
    const container = renderWithProvider(createElement(Honeypot, { contentId: 'abc123' }))
    const el = container.querySelector('[data-content-id="abc123"]')
    expect(el).not.toBeNull()
  })
})
