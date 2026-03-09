export function createClipboardInterceptor(target?: HTMLElement | null): { attach: () => void; detach: () => void } {
  let handler: ((e: ClipboardEvent) => void) | null = null
  const element = target ?? (typeof document !== 'undefined' ? document : null)

  function shuffle(text: string): string {
    const chars = [...text]
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    return chars.join('')
  }

  function attach() {
    if (!element) return
    if (handler) return

    handler = (e: ClipboardEvent) => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) return

      if (target && !target.contains(selection.anchorNode)) return

      const selected = selection.toString()
      if (!selected) return

      e.preventDefault()
      e.clipboardData?.setData('text/plain', shuffle(selected))
    }

    element.addEventListener('copy', handler as EventListener)
  }

  function detach() {
    if (!element) return
    if (!handler) return

    element.removeEventListener('copy', handler as EventListener)
    handler = null
  }

  return { attach, detach }
}
