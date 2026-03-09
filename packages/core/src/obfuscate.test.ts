import { obfuscateText } from './obfuscate'
import { describe, expect, test } from 'bun:test'

const SEED = 'test-seed-123'

// ── obfuscateText ──

describe('obfuscateText', () => {
  test('returns { html, css, ariaText, contentId } with correct types', () => {
    const result = obfuscateText('hello world', { seed: SEED })
    expect(typeof result.html).toBe('string')
    expect(typeof result.css).toBe('string')
    expect(typeof result.ariaText).toBe('string')
    expect(typeof result.contentId).toBe('string')
  })

  test('ariaText matches the original input text', () => {
    const text = 'some protected content'
    const result = obfuscateText(text, { seed: SEED })
    expect(result.ariaText).toBe(text)
  })

  test('contentId is an 8-character hex string', () => {
    const { contentId } = obfuscateText('hello', { seed: SEED })
    expect(contentId).toMatch(/^[0-9a-f]{8}$/)
  })

  test('is deterministic (same seed + same text = identical output)', () => {
    const a = obfuscateText('hello world', { seed: SEED })
    const b = obfuscateText('hello world', { seed: SEED })
    expect(a.html).toBe(b.html)
    expect(a.css).toBe(b.css)
    expect(a.contentId).toBe(b.contentId)
  })

  test('different seeds produce different output for the same text', () => {
    const a = obfuscateText('hello world', { seed: 'seed-a' })
    const b = obfuscateText('hello world', { seed: 'seed-b' })
    expect(a.html).not.toBe(b.html)
  })

  test('different text produces different output for the same seed', () => {
    const a = obfuscateText('hello', { seed: SEED })
    const b = obfuscateText('world', { seed: SEED })
    expect(a.html).not.toBe(b.html)
  })

  test('HTML contains data-o attributes (word-level shuffle)', () => {
    const { html } = obfuscateText('hello world', { seed: SEED })
    expect(html).toMatch(/data-o="\d+"/)
  })

  test('HTML contains &nbsp; for space preservation', () => {
    const { html } = obfuscateText('hello world', { seed: SEED })
    expect(html).toContain('&nbsp;')
  })

  test('CSS contains the scoped .obscrd- class', () => {
    const { css, contentId } = obfuscateText('hello world', { seed: SEED })
    expect(css).toContain(`.obscrd-${contentId}`)
  })
})

// ── obfuscateText levels ──

describe('obfuscateText levels', () => {
  test('light: no nested display:inline-flex spans', () => {
    const { html } = obfuscateText('hello world', { seed: SEED, level: 'light' })
    expect(html).not.toContain('display:inline-flex')
  })

  test('light: no decoy spans with aria-hidden and font-size:0', () => {
    const { html } = obfuscateText('hello world', { seed: SEED, level: 'light' })
    expect(html).not.toContain('aria-hidden="true"')
    expect(html).not.toContain('font-size:0')
  })

  test('medium: contains nested display:inline-flex spans', () => {
    const { html } = obfuscateText('hello world', { seed: SEED, level: 'medium' })
    expect(html).toContain('display:inline-flex')
  })

  test('medium: contains aria-hidden decoy spans', () => {
    const { html } = obfuscateText('hello world', { seed: SEED, level: 'medium' })
    expect(html).toContain('aria-hidden="true"')
  })

  test('maximum: CSS contains user-select:none', () => {
    const { css } = obfuscateText('hello world', { seed: SEED, level: 'maximum' })
    expect(css).toContain('user-select:none')
  })

  test('maximum: HTML contains zero-width characters', () => {
    const { html } = obfuscateText('hello world', { seed: SEED, level: 'maximum' })
    const hasZwc = html.includes('\u200d') || html.includes('\u200c')
    expect(hasZwc).toBe(true)
  })

  test('ariaText contains the original text for light and medium levels', () => {
    const text = 'hello world'
    const light = obfuscateText(text, { seed: SEED, level: 'light' })
    const medium = obfuscateText(text, { seed: SEED, level: 'medium' })
    expect(light.ariaText).toBe(text)
    expect(medium.ariaText).toBe(text)
  })

  test('ariaText is empty string for maximum level', () => {
    const result = obfuscateText('hello world', { seed: SEED, level: 'maximum' })
    expect(result.ariaText).toBe('')
  })

  test('light < medium < maximum in HTML length', () => {
    const text = 'hello world test'
    const light = obfuscateText(text, { seed: SEED, level: 'light' })
    const medium = obfuscateText(text, { seed: SEED, level: 'medium' })
    const maximum = obfuscateText(text, { seed: SEED, level: 'maximum' })
    expect(light.html.length).toBeLessThan(medium.html.length)
    expect(medium.html.length).toBeLessThan(maximum.html.length)
  })
})

// ── obfuscateText edge cases ──

describe('obfuscateText edge cases', () => {
  test('empty string does not throw', () => {
    expect(() => obfuscateText('', { seed: SEED })).not.toThrow()
  })

  test('single character works', () => {
    const result = obfuscateText('x', { seed: SEED })
    expect(result.html).toContain('x')
    expect(result.ariaText).toBe('x')
  })

  test('single word works (no word-level shuffle needed)', () => {
    const result = obfuscateText('hello', { seed: SEED })
    expect(result.html).toContain('data-o="0"')
    expect(result.ariaText).toBe('hello')
  })

  test('special HTML chars are escaped in output', () => {
    const { html } = obfuscateText('<script>alert(1)</script>', { seed: SEED })
    expect(html).not.toContain('<script>')
    expect(html).not.toMatch(/<(?!span[ >]|\/span>)/)
  })

  test('very long text (1000+ chars) does not throw', () => {
    const longText = 'word '.repeat(250).trim()
    expect(() => obfuscateText(longText, { seed: SEED })).not.toThrow()
  })
})
