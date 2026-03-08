import { obfuscatePhone } from '@obscrd/core'
import { useMemo } from 'react'

export interface ProtectedPhoneProps {
  phone: string
  children?: string
  className?: string
}

export function ProtectedPhone({ phone, children, className }: ProtectedPhoneProps) {
  const result = useMemo(() => obfuscatePhone(phone), [phone])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <span className={className} aria-label={children ?? phone} dangerouslySetInnerHTML={{ __html: result.html }} />
    </>
  )
}
