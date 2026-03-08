import { obfuscatePhone } from '@obscrd/core'
import { useMemo, useState } from 'react'
import { useObscrdContext } from './provider'
import { srOnly } from './styles'

export interface ProtectedPhoneProps {
  phone: string
  children?: string
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
  const [active, setActive] = useState(false)

  const href = active ? (sms ? `sms:${phone}` : `tel:${phone}`) : '#'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <a
        href={href}
        className={className}
        style={style ? { cursor: 'pointer', ...style } : { cursor: 'pointer' }}
        rel="noopener noreferrer"
        onClick={onClick}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <span style={srOnly}>{children ?? phone}</span>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
      </a>
    </>
  )
}
