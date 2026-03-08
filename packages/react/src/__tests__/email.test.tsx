import { createElement } from 'react'
import { buildMailto, ProtectedEmail } from '../email'
import { renderWithProvider } from './render'
import { describe, expect, test } from 'bun:test'

describe('buildMailto', () => {
  test('builds plain mailto', () => {
    expect(buildMailto('a@b.com', {})).toBe('mailto:a@b.com')
  })

  test('appends subject and body', () => {
    const url = buildMailto('a@b.com', { subject: 'Hi', body: 'Hello there' })
    expect(url).toContain('mailto:a@b.com?')
    expect(url).toContain('subject=Hi')
    expect(url).toContain('body=Hello+there')
  })

  test('appends cc and bcc', () => {
    const url = buildMailto('a@b.com', { cc: 'c@d.com', bcc: 'e@f.com' })
    expect(url).toContain('cc=c%40d.com')
    expect(url).toContain('bcc=e%40f.com')
  })
})

describe('ProtectedEmail', () => {
  test('renders an <a> tag', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    const anchor = container.querySelector('a')
    expect(anchor).not.toBeNull()
  })

  test('href is "#" by default', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('href')).toBe('#')
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

  test('anchor has cursor pointer style', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    const anchor = container.querySelector('a')
    expect(anchor?.style.cursor).toBe('pointer')
  })

  test('anchor has rel="noopener noreferrer"', () => {
    const container = renderWithProvider(createElement(ProtectedEmail, { email: 'test@example.com' }))
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
