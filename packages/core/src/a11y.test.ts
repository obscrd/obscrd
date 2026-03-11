import { fragmentAccessibleText, generateDecoyTexts, generateSrOnlyStyle } from './a11y'
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
    const text = 'Hello world foo bar baz qux'
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

describe('fragmentAccessibleText', () => {
  test('returns fragmentIds, fragments, and describedBy', () => {
    const result = fragmentAccessibleText('Hello world foo bar baz', 'test-seed')
    expect(result.fragmentIds).toBeDefined()
    expect(result.fragments).toBeDefined()
    expect(result.describedBy).toBeDefined()
  })

  test('fragments count is between min and max', () => {
    const result = fragmentAccessibleText('Hello world foo bar baz qux quux', 'test-seed')
    expect(result.fragments.length).toBeGreaterThanOrEqual(2)
    expect(result.fragments.length).toBeLessThanOrEqual(5)
  })

  test('fragment texts concatenate to original text', () => {
    const text = 'Hello world foo bar baz'
    const result = fragmentAccessibleText(text, 'test-seed')
    const reassembled = result.fragments.map((f) => f.text).join('')
    expect(reassembled).toBe(text)
  })

  test('each fragment has a unique ID', () => {
    const result = fragmentAccessibleText('Hello world foo bar', 'test-seed')
    const ids = result.fragments.map((f) => f.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  test('describedBy is space-separated fragment IDs', () => {
    const result = fragmentAccessibleText('Hello world foo bar', 'test-seed')
    expect(result.describedBy).toBe(result.fragmentIds.join(' '))
  })

  test('each fragment has a sr-only style with overflow:hidden', () => {
    const result = fragmentAccessibleText('Hello world foo bar', 'test-seed')
    for (const f of result.fragments) {
      expect(f.style.overflow).toBe('hidden')
    }
  })

  test('is deterministic', () => {
    const a = fragmentAccessibleText('Hello world', 'seed-a')
    const b = fragmentAccessibleText('Hello world', 'seed-a')
    expect(a.fragmentIds).toEqual(b.fragmentIds)
    expect(a.fragments.map((f) => f.text)).toEqual(b.fragments.map((f) => f.text))
  })

  test('short text (1-2 words) produces at least 1 fragment', () => {
    const result = fragmentAccessibleText('Hi', 'test-seed')
    expect(result.fragments.length).toBeGreaterThanOrEqual(1)
    expect(result.fragments[0].text).toBe('Hi')
  })
})
