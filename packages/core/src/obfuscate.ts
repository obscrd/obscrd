import { deriveSeed } from './seed'
import type { ObfuscationResult } from './types'

export interface ObfuscateOptions {
  /** The seed for deterministic obfuscation */
  seed: string
  /** Protection level */
  level?: 'light' | 'medium' | 'maximum'
}

// ── PRNG ──

function mulberry32(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

function seedToNumber(hex: string): number {
  return Number.parseInt(hex.slice(0, 8), 16) || 0x12345678
}

// ── Shuffle ──

function fisherYatesShuffle<T>(arr: T[], rng: () => number): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ── Segments ──

// Split text into words (preserving trailing whitespace with each word)
function splitWords(text: string): string[] {
  const matches = text.match(/\S+\s*/g)
  return matches ?? [text]
}

// Split a word into individual characters
function splitChars(word: string): string[] {
  return [...word]
}

// ── Decoys ──

function generateDecoyChar(rng: () => number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return chars[Math.floor(rng() * chars.length)]
}

const HIDDEN_STYLE = 'position:absolute;clip:rect(0,0,0,0);font-size:0;width:0;height:0;overflow:hidden'

function buildDecoySpan(rng: () => number): string {
  const char = generateDecoyChar(rng)
  return `<span aria-hidden="true" style="${HIDDEN_STYLE}">${char}</span>`
}

// ── Core ──

// Build character-level obfuscation within a single word (for medium/maximum)
function obfuscateWord(word: string, rng: () => number, level: 'medium' | 'maximum'): string {
  const chars = splitChars(word)
  const indices = chars.map((_, i) => i)
  const shuffled = fisherYatesShuffle(indices, rng)

  const spans: string[] = []
  for (const idx of shuffled) {
    const escaped = escapeHtml(chars[idx])
    spans.push(`<span data-o="${idx}" style="order:${idx}">${escaped}</span>`)

    spans.push(buildDecoySpan(rng))

    if (level === 'maximum') {
      const zwc = rng() > 0.5 ? '\u200d' : '\u200c'
      spans.push(`<span aria-hidden="true" style="${HIDDEN_STYLE}">${zwc}</span>`)
    }
  }

  return `<span style="display:inline-flex">${spans.join('')}</span>`
}

/**
 * Obfuscate a text string into scrambled HTML + CSS that renders normally
 */
export function obfuscateText(text: string, options: ObfuscateOptions): ObfuscationResult {
  const level = options.level ?? 'medium'
  const derived = deriveSeed(options.seed, text)
  const contentId = derived.slice(0, 8)
  const rng = mulberry32(seedToNumber(derived))

  const words = splitWords(text)
  const wordIndices = words.map((_, i) => i)
  const shuffledWordIndices = fisherYatesShuffle(wordIndices, rng)

  // Outer level: word-spans in shuffled DOM order, order property restores visual sequence
  const wordSpans: string[] = []

  for (const wi of shuffledWordIndices) {
    const word = words[wi]

    let inner: string
    if (level === 'light') {
      // Light: no character-level shuffling, just word-level DOM reorder
      inner = escapeHtml(word)
    } else {
      // Medium/maximum: also shuffle characters within each word
      inner = obfuscateWord(word, rng, level)
    }

    wordSpans.push(`<span data-o="${wi}" style="order:${wi}">${inner}</span>`)
  }

  const cls = `obscrd-${contentId}`
  const userSelect = level === 'maximum' ? 'user-select:none;-webkit-user-select:none;' : ''
  const html = `<span class="${cls}">${wordSpans.join('')}</span>`
  const css = `.${cls}{display:flex;flex-wrap:wrap;${userSelect}}`

  return { html, css, ariaText: text, contentId }
}

// ── Helpers ──

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
