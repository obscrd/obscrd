import { obfuscatePhone } from '@obscrd/core'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useObscrdContext } from './provider'

export interface ProtectedPhoneProps {
  phone: string
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

export function ProtectedPhone({ phone, children, className }: ProtectedPhoneProps) {
  const { config } = useObscrdContext()
  const result = useMemo(() => obfuscatePhone(phone, config.seed), [phone, config.seed])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: result.css }} />
      <span className={className}>
        <span style={srOnly}>{children ?? phone}</span>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: result.html }} />
      </span>
    </>
  )
}
