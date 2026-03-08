import { obfuscateEmail } from '@obscrd/core'
import { useMemo } from 'react'
import { useObscrdContext } from './provider'
import { srOnly } from './styles'

export interface ProtectedEmailProps {
  email: string
  /** Optional display text (defaults to the email) */
  children?: string
  className?: string
}

export function ProtectedEmail({ email, children, className }: ProtectedEmailProps) {
  const { config } = useObscrdContext()
  const result = useMemo(() => obfuscateEmail(email, config.seed), [email, config.seed])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <span className={className}>
        <span style={srOnly}>{children ?? email}</span>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
      </span>
    </>
  )
}
