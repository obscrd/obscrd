import { createElement } from 'react'
import { ProtectedEmail } from '../email'
import { renderWithProvider } from './render'
import { describe, expect, test } from 'bun:test'

describe('ProtectedEmail', () => {
  test('renders without crashing', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    expect(container.innerHTML).toBeTruthy()
  })

  test('output contains RTL CSS', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    const style = container.querySelector('style')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('direction:rtl')
  })

  test('has sr-only span with email text', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    const srOnly = container.querySelector('span[style*="clip"]')
    expect(srOnly).not.toBeNull()
    expect(srOnly?.textContent).toBe('test@example.com')
  })

  test('uses children as sr-only text when provided', () => {
    const container = renderWithProvider(
      createElement(ProtectedEmail, { email: 'test@example.com', children: 'Email me' }),
    )
    const srOnly = container.querySelector('span[style*="clip"]')
    expect(srOnly?.textContent).toBe('Email me')
  })

  test('obfuscated span has aria-hidden', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    const hidden = container.querySelector('[aria-hidden="true"]')
    expect(hidden).not.toBeNull()
  })
})
