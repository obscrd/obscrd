import { createSeed, deriveSeed } from './seed'
import { describe, expect, test } from 'bun:test'

// ── createSeed ──

describe('createSeed', () => {
  test('returns a 32-character string', () => {
    expect(createSeed()).toHaveLength(32)
  })

  test('contains only hex characters', () => {
    expect(createSeed()).toMatch(/^[0-9a-f]{32}$/)
  })

  test('generates unique values across calls', () => {
    const seeds = Array.from({ length: 10 }, () => createSeed())
    const unique = new Set(seeds)
    expect(unique.size).toBe(10)
  })
})

// ── deriveSeed ──

describe('deriveSeed', () => {
  test('returns a 16-character hex string', () => {
    const result = deriveSeed('a'.repeat(32), 'block-1')
    expect(result).toMatch(/^[0-9a-f]{16}$/)
  })

  test('is deterministic for the same inputs', () => {
    const seed = createSeed()
    const a = deriveSeed(seed, 'content-1')
    const b = deriveSeed(seed, 'content-1')
    expect(a).toBe(b)
  })

  test('different masterSeed produces different output', () => {
    const a = deriveSeed('a'.repeat(32), 'same-id')
    const b = deriveSeed('b'.repeat(32), 'same-id')
    expect(a).not.toBe(b)
  })

  test('different contentId produces different output', () => {
    const seed = 'c'.repeat(32)
    const a = deriveSeed(seed, 'id-1')
    const b = deriveSeed(seed, 'id-2')
    expect(a).not.toBe(b)
  })

  test('does not return all zeros or the fallback value', () => {
    const result = deriveSeed(createSeed(), 'test')
    expect(result).not.toBe('0000000000000000')
  })
})
