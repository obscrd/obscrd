/**
 * Detect when browser DevTools are opened and trigger a callback.
 * Uses the debugger-timing heuristic — opt-in, intended for production only.
 * May be blocked by CSP if `new Function` is restricted.
 */
export function detectDevTools(onDetect: () => void): { start: () => void; stop: () => void } {
  let intervalId: ReturnType<typeof setInterval> | null = null
  const THRESHOLD_MS = 100
  const POLL_MS = 1000

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
    }
  }

  function start() {
    if (typeof window === 'undefined') return
    if (intervalId) return

    intervalId = setInterval(check, POLL_MS)
  }

  function stop() {
    if (intervalId === null) return

    clearInterval(intervalId)
    intervalId = null
  }

  return { start, stop }
}
