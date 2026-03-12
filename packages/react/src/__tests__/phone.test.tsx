import { createElement, createRef } from 'react'
import { ProtectedPhone } from '../phone'
import { renderWithProvider } from './render'
import { describe, expect, test } from 'bun:test'

describe('ProtectedPhone', () => {
  test('renders an <a> tag', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567' }))
    const anchor = container.querySelector('a')
    expect(anchor).not.toBeNull()
  })

  test('href is "#" by default', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567' }))
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('href')).toBe('#')
  })

  test('output contains RTL CSS', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567' }))
    const style = container.querySelector('style')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('direction:rtl')
  })

  test('has sr-only span with phone text', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567' }))
    const srOnly = container.querySelector('span[style*="clip"]')
    expect(srOnly).not.toBeNull()
    expect(srOnly?.textContent).toBe('+1-555-123-4567')
  })

  test('uses children as sr-only text when provided', () => {
    const container = renderWithProvider(
      createElement(ProtectedPhone, { phone: '+1-555-123-4567', children: 'Call us' }),
    )
    const srOnly = container.querySelector('span[style*="clip"]')
    expect(srOnly?.textContent).toBe('Call us')
  })

  test('obfuscated span has aria-hidden', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567' }))
    const hidden = container.querySelector('[aria-hidden="true"]')
    expect(hidden).not.toBeNull()
  })

  test('anchor has cursor pointer style', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567' }))
    const anchor = container.querySelector('a')
    expect(anchor?.style.cursor).toBe('pointer')
  })

  test('anchor has rel="noopener noreferrer"', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567' }))
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  test('forwards ref to the <a> element', () => {
    const ref = createRef<HTMLAnchorElement>()
    renderWithProvider(createElement(ProtectedPhone, { ref, phone: '+1-555-123-4567' }))
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  test('obfuscate={false} renders plain phone text', () => {
    const container = renderWithProvider(createElement(ProtectedPhone, { phone: '+1-555-123-4567', obfuscate: false }))
    const anchor = container.querySelector('a')
    expect(anchor?.textContent).toBe('+1-555-123-4567')
    expect(anchor?.getAttribute('href')).toBe('tel:+1-555-123-4567')
    const style = container.querySelector('style')
    expect(style).toBeNull()
  })
})

describe('ProtectedPhone hardened mode', () => {
  test('renders decoy elements with display:none', () => {
    const container = renderWithProvider(
      createElement(ProtectedPhone, { phone: '+1-555-123-4567' }),
      'test-seed',
      'hardened',
    )
    const decoys = Array.from(container.querySelectorAll('span')).filter((s) => s.style.display === 'none')
    expect(decoys.length).toBeGreaterThanOrEqual(1)
  })

  test('sr-only span uses randomized style', () => {
    const container = renderWithProvider(
      createElement(ProtectedPhone, { phone: '+1-555-123-4567' }),
      'test-seed',
      'hardened',
    )
    const hiddenSpans = Array.from(container.querySelectorAll('span')).filter(
      (s) => s.style.overflow === 'hidden' && !s.getAttribute('aria-hidden') && s.style.display !== 'none',
    )
    expect(hiddenSpans.length).toBeGreaterThan(0)
  })
})
