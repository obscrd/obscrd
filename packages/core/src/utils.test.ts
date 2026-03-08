import { escapeHtml, fisherYatesShuffle, mulberry32 } from './utils'
import { describe, expect, test } from 'bun:test'

// ── mulberry32 ──

describe('mulberry32', () => {
  test('returns a function', () => {
    expect(typeof mulberry32(42)).toBe('function')
  })

  test('produces values between 0 and 1', () => {
    const rng = mulberry32(123)
    for (let i = 0; i < 100; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  test('same seed produces same sequence', () => {
    const a = mulberry32(999)
    const b = mulberry32(999)
    for (let i = 0; i < 20; i++) {
      expect(a()).toBe(b())
    }
  })

  test('different seeds produce different sequences', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    const seqA = Array.from({ length: 5 }, () => a())
    const seqB = Array.from({ length: 5 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })
})

// ── fisherYatesShuffle ──

describe('fisherYatesShuffle', () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  test('returns a new array', () => {
    const rng = mulberry32(42)
    const result = fisherYatesShuffle(input, rng)
    expect(result).not.toBe(input)
  })

  test('same length as input', () => {
    const rng = mulberry32(42)
    const result = fisherYatesShuffle(input, rng)
    expect(result).toHaveLength(input.length)
  })

  test('contains same elements as input', () => {
    const rng = mulberry32(42)
    const result = fisherYatesShuffle(input, rng)
    expect([...result].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b))
  })

  test('produces deterministic output with a fixed rng', () => {
    const a = fisherYatesShuffle(input, mulberry32(77))
    const b = fisherYatesShuffle(input, mulberry32(77))
    expect(a).toEqual(b)
  })

  test('does not return the original order', () => {
    const rng = mulberry32(42)
    const result = fisherYatesShuffle(input, rng)
    const isSameOrder = result.every((v, i) => v === input[i])
    expect(isSameOrder).toBe(false)
  })
})

// ── escapeHtml ──

describe('escapeHtml', () => {
  test('escapes &, <, >, ", \'', () => {
    expect(escapeHtml('&')).toBe('&amp;')
    expect(escapeHtml('<')).toBe('&lt;')
    expect(escapeHtml('>')).toBe('&gt;')
    expect(escapeHtml('"')).toBe('&quot;')
    expect(escapeHtml("'")).toBe('&#39;')
  })

  test('leaves normal text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })

  test('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })
})
