import { obfuscatePhone } from '@obscrd/core'
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
            <span style={srOnly}>{children ?? phone}</span>
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
          </>
        ) : (
          (children ?? phone)
        )}
      </ProtectedLink>
    </>
  )
})

ProtectedPhone.displayName = 'ProtectedPhone'
