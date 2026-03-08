import { createElement } from 'react'
import { ProtectedText } from '../text'
import { renderWithProvider } from './render'
import { describe, expect, test } from 'bun:test'

describe('ProtectedText', () => {
  test('renders without crashing', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello world'))
    expect(container.innerHTML).toBeTruthy()
  })

  test('output contains shuffled spans with data-o attributes', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello'))
    expect(container.querySelectorAll('[data-o]').length).toBeGreaterThan(0)
  })

  test('does not use aria-label on generic elements', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello world'))
    const el = container.querySelector('[aria-label]')
    expect(el).toBeNull()
  })

  test('injects a style tag with obscrd class', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello'))
    const style = container.querySelector('style')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('.obscrd-')
  })

  test('respects level prop override', () => {
    const light = renderWithProvider(createElement(ProtectedText, { level: 'light' }, 'Hello'))
    const max = renderWithProvider(createElement(ProtectedText, { level: 'maximum' }, 'Hello'))
    // Maximum level adds user-select:none in the CSS
    const maxStyle = max.querySelector('style')?.textContent ?? ''
    const lightStyle = light.querySelector('style')?.textContent ?? ''
    expect(maxStyle).toContain('user-select:none')
    expect(lightStyle).not.toContain('user-select:none')
  })

  test('respects as prop', () => {
    const container = renderWithProvider(createElement(ProtectedText, { as: 'p' }, 'Hello'))
    const p = container.querySelector('p')
    expect(p).not.toBeNull()
    expect(p?.querySelector('[data-o]')).not.toBeNull()
  })

  test('applies className', () => {
    const container = renderWithProvider(createElement(ProtectedText, { className: 'custom' }, 'Hi'))
    const el = container.querySelector('.custom')
    expect(el).not.toBeNull()
  })
})
