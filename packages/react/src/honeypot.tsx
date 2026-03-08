import { generateHoneypot } from '@obscrd/core'
import { useMemo } from 'react'
import { useObscrdContext } from './provider'

export interface HoneypotProps {
  /** Custom copyright notice */
  copyrightNotice?: string
  /** Content ID for forensic tracking */
  contentId?: string
}

export function Honeypot({ copyrightNotice, contentId }: HoneypotProps) {
  const { config } = useObscrdContext()

  const html = useMemo(
    () =>
      generateHoneypot({
        contentId,
        copyrightNotice: copyrightNotice ?? config.copyrightNotice,
      }),
    [contentId, copyrightNotice, config.copyrightNotice],
  )

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
