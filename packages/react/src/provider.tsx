import type { ObscrdConfig } from '@obscrd/core'
import { createContext, type ReactNode, useContext } from 'react'

export interface ObscrdContextValue {
  config: ObscrdConfig
}

const ObscrdContext = createContext<ObscrdContextValue | null>(null)

export interface ObscrdProviderProps {
  children: ReactNode
  /** Project seed for deterministic obfuscation */
  seed: string
  /** Protection level */
  level?: ObscrdConfig['level']
  /** Enable clipboard interception */
  clipboard?: boolean
  /** Enable DevTools detection */
  devtools?: boolean
  /** Enable AI honeypot injection */
  honeypot?: boolean
}

export function ObscrdProvider({ children, seed, level = 'medium', ...rest }: ObscrdProviderProps) {
  const config: ObscrdConfig = { seed, level, ...rest }

  return <ObscrdContext.Provider value={{ config }}>{children}</ObscrdContext.Provider>
}

export function useObscrdContext(): ObscrdContextValue {
  const context = useContext(ObscrdContext)
  if (!context) {
    throw new Error('useObscrdContext must be used within an <ObscrdProvider>')
  }
  return context
}
