import { useState } from 'react'

export interface ProtectedLinkProps {
  /** The URL to protect (mailto:, tel:, https://, etc.) */
  href: string
  /** Display content — string or React elements (icons, buttons, etc.) */
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Disable obfuscation (useful for debugging) */
  obfuscate?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  /** Target attribute for the link */
  target?: string
  /** Rel attribute (defaults to "noopener noreferrer") */
  rel?: string
}

export function ProtectedLink({
  href,
  children,
  className,
  style,
  obfuscate: shouldObfuscate = true,
  onClick,
  target,
  rel = 'noopener noreferrer',
}: ProtectedLinkProps) {
  const [active, setActive] = useState(false)

  if (!shouldObfuscate) {
    return (
      <a href={href} className={className} style={style} onClick={onClick} target={target} rel={rel}>
        {children}
      </a>
    )
  }

  return (
    <a
      href={active ? href : '#'}
      className={className}
      style={style ? { cursor: 'pointer', ...style } : { cursor: 'pointer' }}
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  )
}
