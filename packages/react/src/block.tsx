import { createClipboardInterceptor } from '@obscrd/core'
import { type ReactNode, useEffect, useRef } from 'react'
import { useObscrdContext } from './provider'

export interface ProtectedBlockProps {
  children: ReactNode
  className?: string
}

export function ProtectedBlock({ children, className }: ProtectedBlockProps) {
  const { config } = useObscrdContext()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (config.clipboard === false) return

    const interceptor = createClipboardInterceptor()
    interceptor.attach()
    return () => interceptor.detach()
  }, [config.clipboard])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
