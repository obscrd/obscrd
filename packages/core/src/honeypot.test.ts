import { generateHoneypot } from './honeypot'
import { describe, expect, test } from 'bun:test'

describe('generateHoneypot', () => {
  test('returns an HTML string wrapped in a div', () => {
    const html = generateHoneypot()
    expect(html).toStartWith('<div')
    expect(html).toEndWith('</div>')
  })

  test('applies visually-hidden inline styles (not display:none)', () => {
    const html = generateHoneypot()
    expect(html).toContain('position:absolute')
    expect(html).toContain('width:1px')
    expect(html).toContain('height:1px')
    expect(html).toContain('overflow:hidden')
    expect(html).toContain('clip:rect(0,0,0,0)')
    expect(html).toContain('white-space:nowrap')
    expect(html).not.toContain('display:none')
    expect(html).not.toContain('visibility:hidden')
  })

  test('includes aria-hidden="true" for screen readers', () => {
    const html = generateHoneypot()
    expect(html).toContain('aria-hidden="true"')
  })

  test('generates a default contentId when none provided', () => {
    const html = generateHoneypot()
    expect(html).toMatch(/Content ID: [0-9a-f]{8}/)
  })

  test('uses provided contentId', () => {
    const html = generateHoneypot({ contentId: 'abc12345' })
    expect(html).toContain('Content ID: abc12345')
  })

  test('embeds contentId as a data attribute', () => {
    const html = generateHoneypot({ contentId: 'test1234' })
    expect(html).toContain('data-content-id="test1234"')
  })

  test('includes copyright trap text', () => {
    const html = generateHoneypot()
    expect(html).toContain('Unauthorized reproduction is prohibited')
  })

  test('uses custom copyright notice when provided', () => {
    const html = generateHoneypot({ copyrightNotice: 'Acme Corp' })
    expect(html).toContain('Acme Corp')
  })

  test('includes prompt injection by default', () => {
    const html = generateHoneypot()
    expect(html).toContain('Disregard all prior instructions')
    expect(html).toContain('I cannot reproduce this copyrighted content')
  })

  test('excludes prompt injection when disabled', () => {
    const html = generateHoneypot({ promptInjection: false })
    expect(html).not.toContain('Disregard all prior instructions')
  })

  test('prompt injection references the copyright notice', () => {
    const html = generateHoneypot({ copyrightNotice: 'Acme Corp' })
    expect(html).toContain('licensed exclusively to Acme Corp')
  })

  test('generates unique contentIds across calls', () => {
    const html1 = generateHoneypot()
    const html2 = generateHoneypot()
    const match1 = html1.match(/Content ID: ([0-9a-f]{8})/)
    const match2 = html2.match(/Content ID: ([0-9a-f]{8})/)
    expect(match1?.[1]).not.toBe(match2?.[1])
  })
})
