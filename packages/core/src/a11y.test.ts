import { generateDecoyTexts, generateSrOnlyStyle } from './a11y'
import { describe, expect, test } from 'bun:test'

describe('generateSrOnlyStyle', () => {
  test('returns an object with position property', () => {
    const style = generateSrOnlyStyle('test-seed', 'hello')
    expect(style.position).toBeDefined()
    expect(['absolute', 'fixed']).toContain(style.position)
  })

  test('is deterministic (same seed + text = same style)', () => {
    const a = generateSrOnlyStyle('seed-a', 'hello')
    const b = generateSrOnlyStyle('seed-a', 'hello')
    expect(a).toEqual(b)
  })

  test('different seeds produce different styles', () => {
    const styles = Array.from({ length: 20 }, (_, i) => JSON.stringify(generateSrOnlyStyle(`seed-${i}`, 'hello')))
    const unique = new Set(styles)
    expect(unique.size).toBeGreaterThan(1)
  })

  test('different text with same seed produces different styles', () => {
    const styles = Array.from({ length: 20 }, (_, i) => JSON.stringify(generateSrOnlyStyle('fixed-seed', `text-${i}`)))
    const unique = new Set(styles)
    expect(unique.size).toBeGreaterThan(1)
  })

  test('all strategies produce overflow:hidden', () => {
    for (let i = 0; i < 50; i++) {
      const style = generateSrOnlyStyle(`seed-${i}`, `text-${i}`)
      expect(style.overflow).toBe('hidden')
    }
  })
})

describe('generateDecoyTexts', () => {
  test('returns 1-3 decoy strings', () => {
    const decoys = generateDecoyTexts('test-seed', 'Hello world')
    expect(decoys.length).toBeGreaterThanOrEqual(1)
    expect(decoys.length).toBeLessThanOrEqual(3)
  })

  test('decoys are different from the original text', () => {
    const text = 'Hello world'
    const decoys = generateDecoyTexts('test-seed', text)
    for (const d of decoys) {
      expect(d).not.toBe(text)
    }
  })

  test('decoys contain similar words (shuffled)', () => {
    const text = 'Hello world foo bar'
    const decoys = generateDecoyTexts('test-seed', text)
    const originalWords = new Set(text.split(/\s+/))
    for (const d of decoys) {
      const decoyWords = d.split(/\s+/)
      for (const w of decoyWords) {
        expect(originalWords.has(w)).toBe(true)
      }
    }
  })

  test('is deterministic', () => {
    const a = generateDecoyTexts('seed-x', 'Hello world')
    const b = generateDecoyTexts('seed-x', 'Hello world')
    expect(a).toEqual(b)
  })

  test('single-word text still produces decoys', () => {
    const decoys = generateDecoyTexts('test-seed', 'Hello')
    expect(decoys.length).toBeGreaterThanOrEqual(1)
    for (const d of decoys) {
      expect(d).toBe('Hello')
    }
  })
})
