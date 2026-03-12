export type AccessibilityMode = 'standard' | 'hardened' | 'maximum'

export interface ObscrdConfig {
  /** Project seed for deterministic obfuscation */
  seed: string
  /** Protection level: light adds minimal obfuscation, maximum adds all layers */
  level?: 'light' | 'medium' | 'maximum'
  /** Accessibility mode: standard is default, hardened/maximum randomize sr-only DOM */
  accessibilityMode?: AccessibilityMode
  /** Enable clipboard interception */
  clipboard?: boolean
  /** Enable DevTools detection */
  devtools?: boolean
  /** Enable AI honeypot injection */
  honeypot?: boolean
  /** Custom copyright notice for honeypots */
  copyrightNotice?: string
  /** Content ID prefix for forensic tracking */
  contentIdPrefix?: string
}

export interface ObfuscationResult {
  /** The obfuscated HTML string */
  html: string
  /** CSS rules needed to reconstitute the text visually */
  css: string
  /** Clean text for screen readers (sr-only spans in contact components) */
  ariaText: string
  /** Unique content ID for forensic tracking */
  contentId: string
}
