/**
 * Create a cryptographic seed for deterministic obfuscation
 */
export function createSeed(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  }

  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

// ── Hashing ──

function fnv1a(str: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/**
 * Derive a sub-seed for a specific content block
 */
export function deriveSeed(masterSeed: string, contentId: string): string {
  const input = `${masterSeed}:${contentId}`
  const h1 = fnv1a(input)
  const h2 = fnv1a(`${input}:${h1.toString(16)}`)
  const hex1 = h1.toString(16).padStart(8, '0')
  const hex2 = h2.toString(16).padStart(8, '0')
  return `${hex1}${hex2}`
}
