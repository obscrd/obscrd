import { generateDecoyTexts, generateSrOnlyStyle, obfuscatePhone } from '@obscrd/core'
import { forwardRef, useMemo } from 'react'
import { ProtectedLink } from './link'
import { useObscrdContext } from './provider'
import { srOnly } from './styles'

export interface ProtectedPhoneProps {
  phone: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  sms?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  obfuscate?: boolean
  id?: string
  target?: string
  rel?: string
}

export const ProtectedPhone = forwardRef<HTMLAnchorElement, ProtectedPhoneProps>(function ProtectedPhone(
  { phone, children, className, style, sms, onClick, obfuscate = true, id, target, rel },
  ref,
) {
  const { config } = useObscrdContext()
  const result = useMemo(() => obfuscatePhone(phone, config.seed), [phone, config.seed])
  const href = sms ? `sms:${phone}` : `tel:${phone}`
  const isTextChild = typeof children === 'string' || children === undefined
  const displayText = (children as string) ?? phone
  const a11yMode = config.accessibilityMode ?? 'standard'

  const a11y = useMemo(() => {
    if (a11yMode === 'standard' || !obfuscate || !isTextChild) return null
    return {
      srStyle: generateSrOnlyStyle(config.seed, displayText) as React.CSSProperties,
      decoys: generateDecoyTexts(config.seed, displayText),
    }
  }, [a11yMode, config.seed, displayText, obfuscate, isTextChild])

  return (
    <>
      {obfuscate && isTextChild && <style dangerouslySetInnerHTML={{ __html: result.css }} />}
      <ProtectedLink
        ref={ref}
        id={id}
        href={href}
        className={className}
        style={style}
        onClick={onClick}
        obfuscate={obfuscate}
        target={target}
        rel={rel}
      >
        {obfuscate && isTextChild ? (
          <>
            <span style={a11y ? a11y.srStyle : srOnly}>{displayText}</span>
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
            {a11y?.decoys.map((d, i) => (
              <span key={`decoy-${i}`} style={{ display: 'none' }}>
                {d}
              </span>
            ))}
          </>
        ) : (
          (children ?? phone)
        )}
      </ProtectedLink>
    </>
  )
})

ProtectedPhone.displayName = 'ProtectedPhone'
