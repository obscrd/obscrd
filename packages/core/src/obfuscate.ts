import { deriveSeed } from './seed'
import type { ObfuscationResult } from './types'
import { escapeHtml, fisherYatesShuffle, mulberry32, seedToNumber } from './utils'

export interface ObfuscateOptions {
  /** The seed for deterministic obfuscation */
  seed: string
  /** Protection level */
  level?: 'light' | 'medium' | 'maximum'
}

// ── Segments ──

function splitWords(text: string): string[] {
  const matches = text.match(/\S+\s*/g)
  return matches ?? [text]
}

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

function obfuscateWord(word: string, rng: () => number, level: 'medium' | 'maximum'): string {
  const chars = splitChars(word)
  const indices = chars.map((_, i) => i)
  const shuffled = fisherYatesShuffle(indices, rng)

  const spans: string[] = []
  for (const idx of shuffled) {
    const escaped = escapeHtml(chars[idx]).replace(/ /g, '&nbsp;')
    spans.push(`<span data-o="${idx}" style="order:${idx}">${escaped}</span>`)

    if (rng() > 0.4) {
      spans.push(buildDecoySpan(rng))
    }

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

  const wordSpans: string[] = []

  for (const wi of shuffledWordIndices) {
    const word = words[wi]

    let inner: string
    if (level === 'light') {
      inner = escapeHtml(word).replace(/ /g, '&nbsp;')
    } else {
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
