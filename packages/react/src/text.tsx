import { obfuscateText } from '@obscrd/core'
import { forwardRef, type ReactNode, useMemo } from 'react'
import { useObscrdContext } from './provider'

// ── Types ──

type TextElement =
  | 'span'
  | 'p'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'li'
  | 'td'
  | 'th'
  | 'label'
  | 'legend'
  | 'caption'
  | 'blockquote'
  | 'figcaption'
  | 'strong'
  | 'em'
  | 'small'
  | 'mark'
  | 'cite'
  | 'abbr'
  | 'time'
  | 'address'
  | 'dt'
  | 'dd'

export interface ProtectedTextProps {
  children?: ReactNode
  level?: 'light' | 'medium' | 'maximum'
  as?: TextElement
  className?: string
  obfuscate?: boolean
  id?: string
}

export const ProtectedText = forwardRef<HTMLElement, ProtectedTextProps>(function ProtectedText(
  { children, level, as: Tag = 'span', className, obfuscate = true, id },
  ref,
) {
  const { config } = useObscrdContext()

  if (process.env.NODE_ENV !== 'production' && obfuscate && typeof children !== 'string') {
    console.warn(
      '[obscrd] ProtectedText received non-string children. Only plain text is supported — React elements will be converted with String(), which may produce unexpected results.',
    )
  }

  const text = typeof children === 'string' ? children : String(children)
  const effectiveLevel = level ?? config.level ?? 'medium'

  const result = useMemo(
    () => obfuscateText(text, { seed: config.seed, level: effectiveLevel }),
    [text, config.seed, effectiveLevel],
  )

  // Cast needed: ForwardedRef<HTMLElement> doesn't satisfy the intersection of all specific element ref types
  const elementRef = ref as any

  if (!obfuscate) {
    return (
      <Tag ref={elementRef} id={id} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <Tag ref={elementRef} id={id} className={className} dangerouslySetInnerHTML={{ __html: result.html }} />
    </>
  )
})

ProtectedText.displayName = 'ProtectedText'
