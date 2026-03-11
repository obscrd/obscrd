import { ProtectedLink } from '../link'
import { render } from './render'
import { describe, expect, it } from 'bun:test'

describe('ProtectedLink', () => {
  it('renders an <a> tag', () => {
    const container = render(ProtectedLink, { href: 'https://example.com' })
    const a = container.querySelector('a')
    expect(a).toBeTruthy()
  })

  it('href is "#" by default when obfuscated', () => {
    const container = render(ProtectedLink, { href: 'https://example.com' })
    const a = container.querySelector('a')
    expect(a!.getAttribute('href')).toBe('#')
  })

  it('has cursor pointer style', () => {
    const container = render(ProtectedLink, { href: 'https://example.com' })
    const a = container.querySelector('a') as HTMLAnchorElement
    expect(a.style.cursor).toBe('pointer')
  })

  it('has rel="noopener noreferrer" by default', () => {
    const container = render(ProtectedLink, { href: 'https://example.com' })
    const a = container.querySelector('a')
    expect(a!.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('obfuscate=false renders with the real href immediately', () => {
    const container = render(ProtectedLink, { href: 'https://example.com', obfuscate: false })
    const a = container.querySelector('a')
    expect(a!.getAttribute('href')).toBe('https://example.com')
  })
})
