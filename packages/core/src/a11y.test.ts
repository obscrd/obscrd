import { generateSrOnlyStyle } from './a11y'
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
