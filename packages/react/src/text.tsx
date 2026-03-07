import type { ReactNode } from 'react'

export interface ProtectedTextProps {
  children: ReactNode
  /** Override the protection level for this element */
  level?: 'light' | 'medium' | 'maximum'
  /** HTML tag to render */
  as?: keyof HTMLElementTagNameMap
  /** Additional class name */
  className?: string
}

export function ProtectedText({ children, as: Tag = 'span', className }: ProtectedTextProps) {
  // TODO: Implement obfuscation using core engine + CSS reconstitution
  return <Tag className={className}>{children}</Tag>
}
