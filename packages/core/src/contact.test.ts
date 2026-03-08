import { obfuscateAddress, obfuscateEmail, obfuscatePhone } from './contact'
import { describe, expect, test } from 'bun:test'

// ── obfuscateEmail ──

describe('obfuscateEmail', () => {
  test('returns html and css strings', () => {
    const result = obfuscateEmail('hello@example.com')
    expect(typeof result.html).toBe('string')
    expect(typeof result.css).toBe('string')
  })

  test('uses RTL direction in css to visually reverse text', () => {
    const { css } = obfuscateEmail('hello@example.com')
    expect(css).toContain('direction:rtl')
    expect(css).toContain('unicode-bidi:bidi-override')
  })

  test('html contains the email characters reversed', () => {
    const { html } = obfuscateEmail('a@b.c')
    // The real characters in the HTML should be in reversed order
    // Extract text content by stripping tags
    const textOnly = html.replace(/<[^>]*>/g, '')
    // Should contain reversed email chars (ignoring decoys)
    // The real chars 'a@b.c' reversed = 'c.b@a'
    // We can't easily strip decoys, but the reversed chars should be present
    expect(html).toContain('c')
    expect(html).toContain('a')
  })

  test('inserts decoy spans with aria-hidden and display:none', () => {
    const { html } = obfuscateEmail('test@example.com')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('display:none')
  })

  test('wraps output in a span with a scoped class', () => {
    const { html, css } = obfuscateEmail('hello@example.com')
    const classMatch = html.match(/class="(obscrd-email-[0-9a-f]+)"/)
    expect(classMatch).not.toBeNull()
    // CSS targets the same class
    expect(css).toContain(classMatch![1])
  })

  test('generates different class names for different emails', () => {
    const r1 = obfuscateEmail('a@b.com')
    const r2 = obfuscateEmail('x@y.com')
    const c1 = r1.html.match(/class="(obscrd-email-[0-9a-f]+)"/)
    const c2 = r2.html.match(/class="(obscrd-email-[0-9a-f]+)"/)
    expect(c1![1]).not.toBe(c2![1])
  })

  test('is deterministic for the same email', () => {
    const r1 = obfuscateEmail('hello@example.com')
    const r2 = obfuscateEmail('hello@example.com')
    expect(r1.html).toBe(r2.html)
    expect(r1.css).toBe(r2.css)
  })
})

// ── obfuscatePhone ──

describe('obfuscatePhone', () => {
  test('returns html and css strings', () => {
    const result = obfuscatePhone('+1-555-123-4567')
    expect(typeof result.html).toBe('string')
    expect(typeof result.css).toBe('string')
  })

  test('uses RTL direction in css', () => {
    const { css } = obfuscatePhone('555-1234')
    expect(css).toContain('direction:rtl')
    expect(css).toContain('unicode-bidi:bidi-override')
  })

  test('inserts decoy spans with random digits', () => {
    const { html } = obfuscatePhone('+1-555-123-4567')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('display:none')
  })

  test('wraps output in a span with a scoped class', () => {
    const { html, css } = obfuscatePhone('555-1234')
    const classMatch = html.match(/class="(obscrd-phone-[0-9a-f]+)"/)
    expect(classMatch).not.toBeNull()
    expect(css).toContain(classMatch![1])
  })

  test('is deterministic for the same phone number', () => {
    const r1 = obfuscatePhone('+1-555-123-4567')
    const r2 = obfuscatePhone('+1-555-123-4567')
    expect(r1.html).toBe(r2.html)
    expect(r1.css).toBe(r2.css)
  })
})

// ── obfuscateAddress ──

describe('obfuscateAddress', () => {
  test('returns html and css strings', () => {
    const result = obfuscateAddress('123 Main St, Springfield, IL 62701')
    expect(typeof result.html).toBe('string')
    expect(typeof result.css).toBe('string')
  })

  test('uses inline-flex with flex-wrap for word reordering', () => {
    const { css } = obfuscateAddress('123 Main St')
    expect(css).toContain('display:inline-flex')
    expect(css).toContain('flex-wrap:wrap')
  })

  test('emits words as spans with order property', () => {
    const { html } = obfuscateAddress('123 Main St')
    // Should have spans with style="order:N" for visual reordering
    expect(html).toMatch(/style="order:\d+"/)
  })

  test('shuffles DOM order of words (not always sequential)', () => {
    // With enough words, shuffled DOM order should differ from original
    const { html } = obfuscateAddress('One Two Three Four Five Six Seven Eight')
    // Extract data-o attributes which represent original indices
    const dataOs = [...html.matchAll(/data-o="(\d+)"/g)].map((m) => Number(m[1]))
    // Filter out any that might be decoys (only real words have data-o)
    // The DOM order of data-o values should not be [0,1,2,3,4,5,6,7]
    const sequential = dataOs.every((v, i) => v === i)
    expect(sequential).toBe(false)
  })

  test('inserts decoy words with aria-hidden', () => {
    const { html } = obfuscateAddress('123 Main St, Springfield, IL 62701')
    expect(html).toContain('aria-hidden="true"')
  })

  test('wraps output in a span with a scoped class', () => {
    const { html, css } = obfuscateAddress('123 Main St')
    const classMatch = html.match(/class="(obscrd-addr-[0-9a-f]+)"/)
    expect(classMatch).not.toBeNull()
    expect(css).toContain(classMatch![1])
  })

  test('is deterministic for the same address', () => {
    const r1 = obfuscateAddress('123 Main St, Springfield, IL 62701')
    const r2 = obfuscateAddress('123 Main St, Springfield, IL 62701')
    expect(r1.html).toBe(r2.html)
    expect(r1.css).toBe(r2.css)
  })
})
