import { obfuscatePhone } from '@obscrd/core'
import { useMemo } from 'react'
import { useObscrdContext } from './provider'
import { srOnly } from './styles'

export interface ProtectedPhoneProps {
  phone: string
  children?: string
  className?: string
}

export function ProtectedPhone({ phone, children, className }: ProtectedPhoneProps) {
  const { config } = useObscrdContext()
  const result = useMemo(() => obfuscatePhone(phone, config.seed), [phone, config.seed])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <span className={className}>
        <span style={srOnly}>{children ?? phone}</span>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
      </span>
    </>
  )
}
