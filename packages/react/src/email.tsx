import { obfuscateEmail } from '@obscrd/core'
import { useMemo, useState } from 'react'
import { useObscrdContext } from './provider'
import { srOnly } from './styles'

// ── Helpers ──

function buildMailto(email: string, opts: { subject?: string; body?: string; cc?: string; bcc?: string }): string {
  const params = new URLSearchParams()
  if (opts.subject) params.set('subject', opts.subject)
  if (opts.body) params.set('body', opts.body)
  if (opts.cc) params.set('cc', opts.cc)
  if (opts.bcc) params.set('bcc', opts.bcc)
  const query = params.toString()
  return `mailto:${email}${query ? `?${query}` : ''}`
}

export interface ProtectedEmailProps {
  email: string
  /** Optional display text (defaults to the email) */
  children?: string
  className?: string
  style?: React.CSSProperties
  /** Email subject line */
  subject?: string
  /** Email body text */
  body?: string
  /** CC recipients (comma-separated) */
  cc?: string
  /** BCC recipients (comma-separated) */
  bcc?: string
  /** Additional click handler */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export function ProtectedEmail({
  email,
  children,
  className,
  style,
  subject,
  body,
  cc,
  bcc,
  onClick,
}: ProtectedEmailProps) {
  const { config } = useObscrdContext()
  const result = useMemo(() => obfuscateEmail(email, config.seed), [email, config.seed])
  const [active, setActive] = useState(false)

  const href = active ? buildMailto(email, { subject, body, cc, bcc }) : '#'

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
        <span style={srOnly}>{children ?? email}</span>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
      </a>
    </>
  )
}

export { buildMailto }
