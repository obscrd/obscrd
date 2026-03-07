export interface ProtectedEmailProps {
  email: string
  /** Optional display text (defaults to the email) */
  children?: string
  className?: string
}

export function ProtectedEmail({ email, children, className }: ProtectedEmailProps) {
  // TODO: Implement email obfuscation
  return <span className={className}>{children ?? email}</span>
}
