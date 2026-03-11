import { deriveSeed } from './seed'
import { mulberry32, seedToNumber } from './utils'

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

export function generateSrOnlyStyle(seed: string, text: string): SrOnlyStyle {
  const derived = deriveSeed(seed, `a11y:${text}`)
  const rng = mulberry32(seedToNumber(derived))
  const idx = Math.floor(rng() * STRATEGIES.length)
  return STRATEGIES[idx](rng)
}
