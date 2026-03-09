import { deriveSeed } from '@obscrd/core'
import { forwardRef, useMemo } from 'react'
import { useObscrdContext } from './provider'

export interface BreadcrumbProps {
  id?: string
}

export const Breadcrumb = forwardRef<HTMLSpanElement, BreadcrumbProps>(function Breadcrumb({ id }, ref) {
  const { config } = useObscrdContext()

  const contentId = useMemo(() => {
    if (id) return id
    return deriveSeed(config.seed, 'breadcrumb').slice(0, 8)
  }, [id, config.seed])

  if (process.env.NODE_ENV !== 'production' && !id) {
    console.warn(
      '[obscrd] Breadcrumb without an explicit `id` — all breadcrumbs with the same seed will share the same ID. Pass a unique `id` for forensic tracking.',
    )
  }

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-obscrd-breadcrumb={contentId}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        padding: 0,
        border: 0,
      }}
    >
      {contentId}
    </span>
  )
})

Breadcrumb.displayName = 'Breadcrumb'
