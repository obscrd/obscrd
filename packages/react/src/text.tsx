import { fragmentAccessibleText, generateCssContentA11y, generateDecoyTexts, obfuscateText } from '@obscrd/core'
import { forwardRef, type ReactNode, useMemo } from 'react'
import { useObscrdContext } from './provider'
import { srOnly } from './styles'

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
  const a11yMode = config.accessibilityMode ?? 'standard'

  const result = useMemo(
    () => obfuscateText(text, { seed: config.seed, level: effectiveLevel }),
    [text, config.seed, effectiveLevel],
  )

  const a11y = useMemo(() => {
    if (a11yMode === 'standard') return null
    return {
      decoys: generateDecoyTexts(config.seed, text),
      fragments: fragmentAccessibleText(text, config.seed),
      cssContent: a11yMode === 'maximum' ? generateCssContentA11y(text, config.seed) : null,
    }
  }, [a11yMode, config.seed, text])

  // Cast needed: ForwardedRef<HTMLElement> doesn't satisfy the intersection of all specific element ref types
  const elementRef = ref as any

  if (!obfuscate) {
    return (
      <Tag ref={elementRef} id={id} className={className}>
        {children}
      </Tag>
    )
  }

  // ── Standard mode (Phase 1 behavior) ──
  if (!a11y) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: result.css }} />
        <Tag ref={elementRef} id={id} className={className}>
          <span style={srOnly}>{text}</span>
          <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
        </Tag>
      </>
    )
  }

  // ── Hardened / Maximum mode ──
  const { fragments, decoys, cssContent } = a11y
  const tagClassName = cssContent ? `${className ?? ''} ${cssContent.className}`.trim() || undefined : className

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      {cssContent && <style dangerouslySetInnerHTML={{ __html: cssContent.css }} />}

      {/* Fragments — scattered sr-only spans with unique IDs */}
      {fragments.fragments.map((f) => (
        <span key={f.id} id={f.id} style={f.style as React.CSSProperties}>
          {f.text}
        </span>
      ))}

      {/* Decoys — display:none, invisible to screen readers */}
      {decoys.map((d, i) => (
        <span key={`decoy-${i}`} style={{ display: 'none' }}>
          {d}
        </span>
      ))}

      <Tag ref={elementRef} id={id} className={tagClassName} aria-describedby={fragments.describedBy}>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
      </Tag>
    </>
  )
})

ProtectedText.displayName = 'ProtectedText'
