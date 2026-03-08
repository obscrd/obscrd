import { obfuscatePhone } from '@obscrd/core'
import { useMemo } from 'react'
import { ProtectedLink } from './link'
import { useObscrdContext } from './provider'
import { srOnly } from './styles'

export interface ProtectedPhoneProps {
  phone: string
  /** Display content — string for obfuscated text, or React elements (icons, buttons, etc.) */
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Use sms: instead of tel: */
  sms?: boolean
  /** Additional click handler */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export function ProtectedPhone({ phone, children, className, style, sms, onClick }: ProtectedPhoneProps) {
  const { config } = useObscrdContext()
  const result = useMemo(() => obfuscatePhone(phone, config.seed), [phone, config.seed])
  const href = sms ? `sms:${phone}` : `tel:${phone}`
  const isTextChild = typeof children === 'string' || children === undefined

  return (
    <>
      {isTextChild && <style dangerouslySetInnerHTML={{ __html: result.css }} />}
      <ProtectedLink href={href} className={className} style={style} onClick={onClick}>
        {isTextChild ? (
          <>
            <span style={srOnly}>{children ?? phone}</span>
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
          </>
        ) : (
          children
        )}
      </ProtectedLink>
    </>
  )
}
