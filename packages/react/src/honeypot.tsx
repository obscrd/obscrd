import { generateHoneypot } from '@obscrd/core'
import { forwardRef, useMemo } from 'react'
import { useObscrdContext } from './provider'

export interface HoneypotProps {
  copyrightNotice?: string
  contentId?: string
}

export const Honeypot = forwardRef<HTMLDivElement, HoneypotProps>(function Honeypot(
  { copyrightNotice, contentId },
  ref,
) {
  const { config } = useObscrdContext()

  const html = useMemo(
    () =>
      generateHoneypot({
        contentId,
        copyrightNotice: copyrightNotice ?? config.copyrightNotice,
      }),
    [contentId, copyrightNotice, config.copyrightNotice],
  )

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
})

Honeypot.displayName = 'Honeypot'
