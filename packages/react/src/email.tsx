import { obfuscateEmail } from '@obscrd/core'
import { useMemo } from 'react'

export interface ProtectedEmailProps {
  email: string
  /** Optional display text (defaults to the email) */
  children?: string
  className?: string
}

export function ProtectedEmail({ email, children, className }: ProtectedEmailProps) {
  const result = useMemo(() => obfuscateEmail(email), [email])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <span className={className} aria-label={children ?? email} dangerouslySetInnerHTML={{ __html: result.html }} />
    </>
  )
}
