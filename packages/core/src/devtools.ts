/**
 * Detect when browser DevTools are opened and trigger a callback.
 * Uses the debugger-timing heuristic — opt-in, intended for production only.
 * May be blocked by CSP if `new Function` is restricted.
 */
export function detectDevTools(onDetect: () => void): { start: () => void; stop: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const THRESHOLD_MS = 100
  const INITIAL_MS = 1000
  const MAX_MS = 5000
  let currentInterval = INITIAL_MS

  function check() {
    const before = performance.now()
    try {
      new Function('debugger')()
    } catch {
      // CSP blocks new Function — skip detection
      return
    }
    const elapsed = performance.now() - before
    if (elapsed > THRESHOLD_MS) {
      onDetect()
      currentInterval = INITIAL_MS
    } else {
      currentInterval = Math.min(currentInterval * 2, MAX_MS)
    }
    timeoutId = setTimeout(check, currentInterval)
  }

  function start() {
    if (typeof window === 'undefined') return
    if (timeoutId) return

    currentInterval = INITIAL_MS
    timeoutId = setTimeout(check, currentInterval)
  }

  function stop() {
    if (timeoutId === null) return

    clearTimeout(timeoutId)
    timeoutId = null
  }

  return { start, stop }
}
