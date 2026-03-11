import { deriveSeed } from './seed'
import { fisherYatesShuffle, mulberry32, seedToNumber } from './utils'

// ── Types ──

export interface SrOnlyStyle {
  position: 'absolute' | 'fixed'
  width?: string
  height?: string
  padding?: string | number
  margin?: string
  overflow: 'hidden'
  clip?: string
  clipPath?: string
  whiteSpace?: 'nowrap'
  border?: string | number
  left?: string
  top?: string
  opacity?: string
  pointerEvents?: 'none'
}

// ── Hiding Strategies ──

type Strategy = (rng: () => number) => SrOnlyStyle

const STRATEGIES: Strategy[] = [
  // Classic sr-only (clip rect)
  () => ({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: '0',
  }),
  // clip-path inset
  () => ({
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  }),
  // Off-screen left
  () => ({
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  }),
  // Zero-size with opacity
  () => ({
    position: 'absolute',
    opacity: '0',
    width: '0',
    height: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
  }),
  // Fixed off-screen with random inset
  (rng) => ({
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: `inset(${Math.floor(rng() * 50) + 50}%)`,
  }),
]

// ── Public API ──

export function generateDecoyTexts(seed: string, text: string): string[] {
  const derived = deriveSeed(seed, `decoy:${text}`)
  const rng = mulberry32(seedToNumber(derived))
  const count = 1 + Math.floor(rng() * 3)

  const words = text.split(/\s+/)
  const decoys: string[] = []

  for (let i = 0; i < count; i++) {
    const decoySeed = deriveSeed(seed, `decoy:${i}:${text}`)
    const decoyRng = mulberry32(seedToNumber(decoySeed))
    const shuffled = fisherYatesShuffle([...words], decoyRng)
    decoys.push(shuffled.join(' '))
  }

  return decoys
}

export interface A11yFragment {
  id: string
  text: string
  style: SrOnlyStyle
}

export interface FragmentedA11yResult {
  fragmentIds: string[]
  fragments: A11yFragment[]
  describedBy: string
}

export function fragmentAccessibleText(
  text: string,
  seed: string,
  options?: { minFragments?: number; maxFragments?: number },
): FragmentedA11yResult {
  const min = options?.minFragments ?? 2
  const max = options?.maxFragments ?? 5
  const derived = deriveSeed(seed, `frag:${text}`)
  const rng = mulberry32(seedToNumber(derived))

  const fragmentCount = Math.max(1, min + Math.floor(rng() * (max - min + 1)))

  // Split on whitespace boundaries, keeping whitespace attached
  const tokens = text.match(/\S+\s*/g) ?? [text]
  const tokensPerFragment = Math.max(1, Math.ceil(tokens.length / fragmentCount))

  const fragments: A11yFragment[] = []

  for (let i = 0; i < fragmentCount; i++) {
    const start = i * tokensPerFragment
    if (start >= tokens.length) break
    const end = Math.min(start + tokensPerFragment, tokens.length)
    const fragmentText = tokens.slice(start, end).join('')

    if (!fragmentText) continue

    const fragmentSeed = deriveSeed(seed, `frag:${i}:${text}`)
    const id = `obscrd-a11y-${fragmentSeed.slice(0, 8)}`
    const style = generateSrOnlyStyle(seed, `${i}:${text}`)

    fragments.push({ id, text: fragmentText, style })
  }

  return {
    fragmentIds: fragments.map((f) => f.id),
    fragments,
    describedBy: fragments.map((f) => f.id).join(' '),
  }
}

export function generateSrOnlyStyle(seed: string, text: string): SrOnlyStyle {
  const derived = deriveSeed(seed, `a11y:${text}`)
  const rng = mulberry32(seedToNumber(derived))
  const idx = Math.floor(rng() * STRATEGIES.length)
  return STRATEGIES[idx](rng)
}
