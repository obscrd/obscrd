import { createClipboardInterceptor } from '@obscrd/core'
import { type ReactNode, useEffect } from 'react'
import { useObscrdContext } from './provider'

export interface ProtectedBlockProps {
  children: ReactNode
  className?: string
}

export function ProtectedBlock({ children, className }: ProtectedBlockProps) {
  const { config } = useObscrdContext()

  useEffect(() => {
    if (config.clipboard === false) return

    const interceptor = createClipboardInterceptor()
    interceptor.attach()
    return () => interceptor.detach()
  }, [config.clipboard])

  return <div className={className}>{children}</div>
}
