import { createSeed, type ObscrdConfig } from '@obscrd/core'
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from 'react'

export interface ObscrdContextValue {
  config: ObscrdConfig
}

const ObscrdContext = createContext<ObscrdContextValue | null>(null)

export interface ObscrdProviderProps {
  children: ReactNode
  /** Project seed for deterministic obfuscation (falls back to a random seed if omitted) */
  seed?: string
  /** Protection level */
  level?: ObscrdConfig['level']
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

export function ObscrdProvider({
  children,
  seed,
  level = 'medium',
  clipboard,
  devtools,
  honeypot,
  copyrightNotice,
  contentIdPrefix,
}: ObscrdProviderProps) {
  const fallbackSeed = useRef(createSeed())
  const resolvedSeed = seed ?? fallbackSeed.current

  useEffect(() => {
    if (!seed) {
      console.warn(
        '[obscrd] No seed provided — using a random seed. For deterministic obfuscation and SSR support, run: npx @obscrd/core init',
      )
    }
  }, [seed])

  const config = useMemo<ObscrdConfig>(
    () => ({ seed: resolvedSeed, level, clipboard, devtools, honeypot, copyrightNotice, contentIdPrefix }),
    [resolvedSeed, level, clipboard, devtools, honeypot, copyrightNotice, contentIdPrefix],
  )

  return <ObscrdContext.Provider value={{ config }}>{children}</ObscrdContext.Provider>
}

export function useObscrdContext(): ObscrdContextValue {
  const context = useContext(ObscrdContext)
  if (!context) {
    throw new Error('useObscrdContext must be used within an <ObscrdProvider>')
  }
  return context
}
