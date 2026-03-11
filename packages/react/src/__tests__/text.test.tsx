import { createElement, createRef } from 'react'
import { ProtectedText } from '../text'
import { renderWithProvider } from './render'
import { describe, expect, mock, test } from 'bun:test'

describe('ProtectedText', () => {
  test('renders without crashing', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello world'))
    expect(container.innerHTML).toBeTruthy()
  })

  test('output contains shuffled spans with data-o attributes', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello'))
    const ariaHidden = container.querySelector('[aria-hidden="true"]')
    expect(ariaHidden?.querySelectorAll('[data-o]').length).toBeGreaterThan(0)
  })

  test('renders sr-only span with clean text for screen readers', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello world'))
    const srOnlySpan = container.querySelector('span[style*="clip"]')
    expect(srOnlySpan).not.toBeNull()
    expect(srOnlySpan?.textContent).toBe('Hello world')
  })

  test('obfuscated content has aria-hidden', () => {
    const container = renderWithProvider(createElement(ProtectedText, null, 'Hello world'))
    const ariaHidden = container.querySelector('[aria-hidden="true"]')
    expect(ariaHidden).not.toBeNull()
    expect(ariaHidden?.querySelectorAll('[data-o]').length).toBeGreaterThan(0)
  })

  test('sr-only text is present at maximum level', () => {
    const container = renderWithProvider(createElement(ProtectedText, { level: 'maximum' }, 'Secret content'))
    const srOnlySpan = container.querySelector('span[style*="clip"]')
    expect(srOnlySpan).not.toBeNull()
    expect(srOnlySpan?.textContent).toBe('Secret content')
  })

  test('heading semantics preserved with sr-only approach', () => {
    const container = renderWithProvider(createElement(ProtectedText, { as: 'h1' }, 'Page Title'))
    const h1 = container.querySelector('h1')
    expect(h1).not.toBeNull()
    const srOnlySpan = h1?.querySelector('span[style*="clip"]')
    expect(srOnlySpan?.textContent).toBe('Page Title')
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

  test('forwards ref to the rendered element', () => {
    const ref = createRef<HTMLElement>()
    renderWithProvider(createElement(ProtectedText, { ref }, 'Hello'))
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('SPAN')
  })

  test('forwards ref with custom as prop', () => {
    const ref = createRef<HTMLElement>()
    renderWithProvider(createElement(ProtectedText, { ref, as: 'p' }, 'Hello'))
    expect(ref.current?.tagName).toBe('P')
  })

  test('passes id prop to the rendered element', () => {
    const container = renderWithProvider(createElement(ProtectedText, { id: 'pricing', as: 'h2' }, 'Pricing'))
    const el = container.querySelector('#pricing')
    expect(el).not.toBeNull()
    expect(el?.tagName).toBe('H2')
  })

  test('warns on non-string children in development', () => {
    const warnSpy = mock(() => {})
    const origWarn = console.warn
    console.warn = warnSpy

    renderWithProvider(createElement(ProtectedText, null, 42 as any))

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[obscrd] ProtectedText received non-string children'))
    console.warn = origWarn
  })
})
