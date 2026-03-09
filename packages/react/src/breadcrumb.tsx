import { forwardRef, useMemo } from 'react'

export interface BreadcrumbProps {
  id?: string
}

function generateId(): string {
  return Math.random().toString(16).slice(2, 10)
}

export const Breadcrumb = forwardRef<HTMLSpanElement, BreadcrumbProps>(function Breadcrumb({ id }, ref) {
  const contentId = useMemo(() => id ?? generateId(), [id])

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
