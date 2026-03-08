import { deriveSeed } from './seed'
import { escapeHtml, fisherYatesShuffle, mulberry32, seedToNumber } from './utils'

// ── Helpers ──

function generateDecoyChar(rng: () => number, chars: string): string {
  return chars[Math.floor(rng() * chars.length)]
}

function decoySpan(content: string): string {
  return `<span aria-hidden="true" style="display:none">${content}</span>`
}

// ── obfuscateEmail ──

export function obfuscateEmail(email: string): { html: string; css: string } {
  const derived = deriveSeed('contact', email)
  const rng = mulberry32(seedToNumber(derived))
  const cls = `obscrd-email-${derived.slice(0, 8)}`

  const reversed = [...email].reverse()
  const spans: string[] = []

  for (const ch of reversed) {
    spans.push(escapeHtml(ch))
    if (rng() > 0.4) {
      const junk = generateDecoyChar(rng, 'abcdefghijklmnopqrstuvwxyz0123456789@._-')
      spans.push(decoySpan(junk))
    }
  }

  const html = `<span class="${cls}">${spans.join('')}</span>`
  const css = `.${cls}{direction:rtl;unicode-bidi:bidi-override;}`

  return { html, css }
}

// ── obfuscatePhone ──

export function obfuscatePhone(phone: string): { html: string; css: string } {
  const derived = deriveSeed('contact', phone)
  const rng = mulberry32(seedToNumber(derived))
  const cls = `obscrd-phone-${derived.slice(0, 8)}`

  const reversed = [...phone].reverse()
  const spans: string[] = []

  for (const ch of reversed) {
    spans.push(escapeHtml(ch))
    if (rng() > 0.4) {
      const junk = generateDecoyChar(rng, '0123456789+-() ')
      spans.push(decoySpan(junk))
    }
  }

  const html = `<span class="${cls}">${spans.join('')}</span>`
  const css = `.${cls}{direction:rtl;unicode-bidi:bidi-override;}`

  return { html, css }
}

// ── obfuscateAddress ──

export function obfuscateAddress(address: string): { html: string; css: string } {
  const derived = deriveSeed('contact', address)
  const rng = mulberry32(seedToNumber(derived))
  const cls = `obscrd-addr-${derived.slice(0, 8)}`

  const words = address.match(/\S+/g) ?? [address]
  const indices = words.map((_, i) => i)
  const shuffled = fisherYatesShuffle(indices, rng)

  const decoyWords = ['Suite', '000', 'Apt', 'Floor', 'Box']
  const wordSpans: string[] = []

  for (const idx of shuffled) {
    wordSpans.push(`<span data-o="${idx}" style="order:${idx}">${escapeHtml(words[idx])}</span>`)

    if (rng() > 0.5) {
      const dw = decoyWords[Math.floor(rng() * decoyWords.length)]
      wordSpans.push(`<span aria-hidden="true" style="display:none">${dw}</span>`)
    }
  }

  const html = `<span class="${cls}">${wordSpans.join('')}</span>`
  const css = `.${cls}{display:inline-flex;flex-wrap:wrap;gap:0.25em;}`

  return { html, css }
}
