import { createSeed, detectDevTools, generateHoneypot, type ObscrdConfig } from '@obscrd/core'
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'

export interface ObscrdContextValue {
  config: ObscrdConfig
}

const ObscrdContext = createContext<ObscrdContextValue | null>(null)

export interface ObscrdProviderProps {
  children?: ReactNode
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
  /** Callback when DevTools are detected (requires devtools: true) */
  onDevToolsDetected?: () => void
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
  onDevToolsDetected,
}: ObscrdProviderProps) {
  const [mounted, setMounted] = useState(false)
  const fallbackSeed = useRef(createSeed())
  const resolvedSeed = seed ?? fallbackSeed.current

  useEffect(() => {
    if (!seed) {
      console.warn(
        '[obscrd] No seed provided — using a random seed. For deterministic obfuscation and SSR support, run: npx @obscrd/core init',
      )
      setMounted(true)
    }
  }, [seed])

  // ── DevTools detection ──
  useEffect(() => {
    if (!devtools) return

    const detector = detectDevTools(onDevToolsDetected ?? (() => console.warn('[obscrd] DevTools detected')))
    detector.start()
    return () => detector.stop()
  }, [devtools, onDevToolsDetected])

  const config = useMemo<ObscrdConfig>(
    () => ({ seed: resolvedSeed, level, clipboard, devtools, honeypot, copyrightNotice, contentIdPrefix }),
    [resolvedSeed, level, clipboard, devtools, honeypot, copyrightNotice, contentIdPrefix],
  )

  // ── Auto-injected honeypot ──
  const honeypotHtml = useMemo(
    () => (honeypot ? generateHoneypot({ copyrightNotice, seed: resolvedSeed }) : ''),
    [honeypot, copyrightNotice, resolvedSeed],
  )

  // If no seed provided, wait for mount to avoid SSR hydration mismatch
  if (!seed && !mounted) {
    return <>{children}</>
  }

  return (
    <ObscrdContext.Provider value={{ config }}>
      {children}
      {honeypot && <div dangerouslySetInnerHTML={{ __html: honeypotHtml }} />}
    </ObscrdContext.Provider>
  )
}

ObscrdProvider.displayName = 'ObscrdProvider'

export function useObscrdContext(): ObscrdContextValue {
  const context = useContext(ObscrdContext)
  if (!context) {
    throw new Error('useObscrdContext must be used within an <ObscrdProvider>')
  }
  return context
}
