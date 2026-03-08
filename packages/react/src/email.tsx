import { obfuscateEmail } from '@obscrd/core'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useObscrdContext } from './provider'

export interface ProtectedEmailProps {
  email: string
  /** Optional display text (defaults to the email) */
  children?: string
  className?: string
}

const srOnly: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
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
