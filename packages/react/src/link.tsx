import { forwardRef, useState } from 'react'

export interface ProtectedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  obfuscate?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  target?: string
  rel?: string
  id?: string
}

export const ProtectedLink = forwardRef<HTMLAnchorElement, ProtectedLinkProps>(function ProtectedLink(
  {
    href,
    children,
    className,
    style,
    obfuscate: shouldObfuscate = true,
    onClick,
    target,
    rel = 'noopener noreferrer',
    id,
  },
  ref,
) {
  const [active, setActive] = useState(false)

  if (!shouldObfuscate) {
    return (
      <a ref={ref} id={id} href={href} className={className} style={style} onClick={onClick} target={target} rel={rel}>
        {children}
      </a>
    )
  }

  return (
    <a
      ref={ref}
      id={id}
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
})

ProtectedLink.displayName = 'ProtectedLink'
