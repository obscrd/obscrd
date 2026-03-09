import { obfuscateEmail } from '@obscrd/core'
import { forwardRef, useMemo } from 'react'
import { ProtectedLink } from './link'
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
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  subject?: string
  body?: string
  cc?: string
  bcc?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  obfuscate?: boolean
  id?: string
  target?: string
  rel?: string
}

export const ProtectedEmail = forwardRef<HTMLAnchorElement, ProtectedEmailProps>(function ProtectedEmail(
  { email, children, className, style, subject, body, cc, bcc, onClick, obfuscate = true, id, target, rel },
  ref,
) {
  const { config } = useObscrdContext()
  const result = useMemo(() => obfuscateEmail(email, config.seed), [email, config.seed])
  const href = buildMailto(email, { subject, body, cc, bcc })
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
            <span style={srOnly}>{children ?? email}</span>
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
          </>
        ) : (
          (children ?? email)
        )}
      </ProtectedLink>
    </>
  )
})

ProtectedEmail.displayName = 'ProtectedEmail'

export { buildMailto }
