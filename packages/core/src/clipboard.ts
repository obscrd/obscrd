/**
 * Create a clipboard interceptor that replaces copied text with garbage
 */
export function createClipboardInterceptor(): { attach: () => void; detach: () => void } {
  let handler: ((e: ClipboardEvent) => void) | null = null

  function shuffle(text: string): string {
    const chars = [...text]
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    return chars.join('')
  }

  function attach() {
    if (typeof document === 'undefined') return
    if (handler) return

    handler = (e: ClipboardEvent) => {
      const selected = window.getSelection()?.toString()
      if (!selected) return

      e.preventDefault()
      e.clipboardData?.setData('text/plain', shuffle(selected))
    }

    document.addEventListener('copy', handler as EventListener)
  }

  function detach() {
    if (typeof document === 'undefined') return
    if (!handler) return

    document.removeEventListener('copy', handler as EventListener)
    handler = null
  }

  return { attach, detach }
}
