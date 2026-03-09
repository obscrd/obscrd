import { createElement, createRef } from 'react'
import { ProtectedLink } from '../link'
import { render } from './render'
import { describe, expect, test } from 'bun:test'

describe('ProtectedLink', () => {
  test('renders an <a> tag', () => {
    const container = render(createElement(ProtectedLink, { href: 'https://example.com', children: 'Click me' }))
    const anchor = container.querySelector('a')
    expect(anchor).not.toBeNull()
  })

  test('href is "#" by default (obfuscated)', () => {
    const container = render(createElement(ProtectedLink, { href: 'https://example.com', children: 'Click me' }))
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('href')).toBe('#')
  })

  test('has cursor pointer style', () => {
    const container = render(createElement(ProtectedLink, { href: 'https://example.com', children: 'Click me' }))
    const anchor = container.querySelector('a')
    expect(anchor?.style.cursor).toBe('pointer')
  })

  test('has rel="noopener noreferrer" by default', () => {
    const container = render(createElement(ProtectedLink, { href: 'https://example.com', children: 'Click me' }))
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  test('accepts custom rel and target', () => {
    const container = render(
      createElement(ProtectedLink, {
        href: 'https://example.com',
        children: 'Click me',
        target: '_blank',
        rel: 'nofollow',
      }),
    )
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('target')).toBe('_blank')
    expect(anchor?.getAttribute('rel')).toBe('nofollow')
  })

  test('renders string children as-is', () => {
    const container = render(createElement(ProtectedLink, { href: 'https://example.com', children: 'Click me' }))
    const anchor = container.querySelector('a')
    expect(anchor?.textContent).toBe('Click me')
  })

  test('renders React element children', () => {
    const icon = createElement('svg', { 'data-testid': 'icon' })
    const container = render(createElement(ProtectedLink, { href: 'https://example.com', children: icon }))
    const svg = container.querySelector('[data-testid="icon"]')
    expect(svg).not.toBeNull()
  })

  test('obfuscate={false} renders with the real href immediately', () => {
    const container = render(
      createElement(ProtectedLink, { href: 'https://example.com', children: 'Click me', obfuscate: false }),
    )
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('href')).toBe('https://example.com')
  })

  test('forwards ref to the <a> element', () => {
    const ref = createRef<HTMLAnchorElement>()
    render(createElement(ProtectedLink, { ref, href: 'https://example.com', children: 'Click me' }))
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    expect(ref.current?.tagName).toBe('A')
  })

  test('passes id prop to the <a> element', () => {
    const container = render(
      createElement(ProtectedLink, { href: 'https://example.com', children: 'Click me', id: 'my-link' }),
    )
    const anchor = container.querySelector('#my-link')
    expect(anchor).not.toBeNull()
    expect(anchor?.tagName).toBe('A')
  })

  test('passes className and style through', () => {
    const container = render(
      createElement(ProtectedLink, {
        href: 'https://example.com',
        children: 'Click me',
        className: 'my-link',
        style: { color: 'red' },
      }),
    )
    const anchor = container.querySelector('a')
    expect(anchor?.className).toBe('my-link')
    expect(anchor?.style.color).toBe('red')
  })
})
