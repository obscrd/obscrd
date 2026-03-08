import { obfuscateText } from '@obscrd/core'
import { type ReactNode, useMemo } from 'react'
import { useObscrdContext } from './provider'

export interface ProtectedTextProps {
  children: ReactNode
  /** Override the protection level for this element */
  level?: 'light' | 'medium' | 'maximum'
  /** HTML tag to render */
  as?: keyof HTMLElementTagNameMap
  /** Additional class name */
  className?: string
}

export function ProtectedText({ children, level, as: Tag = 'span', className }: ProtectedTextProps) {
  const { config } = useObscrdContext()
  const text = typeof children === 'string' ? children : String(children)
  const effectiveLevel = level ?? config.level ?? 'medium'

  const result = useMemo(
    () => obfuscateText(text, { seed: config.seed, level: effectiveLevel }),
    [text, config.seed, effectiveLevel],
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <Tag className={className} dangerouslySetInnerHTML={{ __html: result.html }} />
    </>
  )
}
