import { createClipboardInterceptor } from '@obscrd/core'
import { forwardRef, type ReactNode, useCallback, useEffect, useRef } from 'react'
import { useObscrdContext } from './provider'

export interface ProtectedBlockProps {
  children?: ReactNode
  className?: string
}

export const ProtectedBlock = forwardRef<HTMLDivElement, ProtectedBlockProps>(function ProtectedBlock(
  { children, className },
  ref,
) {
  const { config } = useObscrdContext()
  const innerRef = useRef<HTMLDivElement>(null)

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  useEffect(() => {
    if (config.clipboard === false) return
    if (!innerRef.current) return

    const interceptor = createClipboardInterceptor(innerRef.current)
    interceptor.attach()
    return () => interceptor.detach()
  }, [config.clipboard])

  return (
    <div ref={setRefs} className={className}>
      {children}
    </div>
  )
})

ProtectedBlock.displayName = 'ProtectedBlock'
