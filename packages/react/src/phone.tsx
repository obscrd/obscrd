export interface ProtectedPhoneProps {
  phone: string
  children?: string
  className?: string
}

export function ProtectedPhone({ phone, children, className }: ProtectedPhoneProps) {
  // TODO: Implement phone obfuscation
  return <span className={className}>{children ?? phone}</span>
}
