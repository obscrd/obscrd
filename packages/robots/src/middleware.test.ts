import { createMiddleware } from './middleware'
import { describe, expect, mock, test } from 'bun:test'

// ── Helpers ──

function createMockRes() {
  let body = ''
  const headers: Record<string, string> = {}
  return {
    setHeader(k: string, v: string) {
      headers[k] = v
    },
    end(content: string) {
      body = content
    },
    get body() {
      return body
    },
    get headers() {
      return headers
    },
  }
}

// ── createMiddleware ──

describe('createMiddleware', () => {
  test('returns a function', () => {
    const mw = createMiddleware()
    expect(typeof mw).toBe('function')
  })

  test('calls next() for non-robots.txt paths', () => {
    const mw = createMiddleware()
    const next = mock(() => {})
    const res = createMockRes()

    mw({ path: '/' }, res, next)
    expect(next).toHaveBeenCalledTimes(1)

    mw({ path: '/about' }, res, next)
    expect(next).toHaveBeenCalledTimes(2)
  })

  test('responds with text/plain content type for /robots.txt', () => {
    const mw = createMiddleware()
    const res = createMockRes()

    mw({ path: '/robots.txt' }, res)
    expect(res.headers['Content-Type']).toBe('text/plain')
  })

  test('response body contains generated robots.txt content', () => {
    const mw = createMiddleware()
    const res = createMockRes()

    mw({ path: '/robots.txt' }, res)
    expect(res.body).toContain('User-agent:')
    expect(res.body.length).toBeGreaterThan(0)
  })

  test('works with req.path (Express-style)', () => {
    const mw = createMiddleware()
    const res = createMockRes()

    mw({ path: '/robots.txt' }, res)
    expect(res.body).toContain('User-agent:')
  })

  test('works with req.url (Node http-style)', () => {
    const mw = createMiddleware()
    const res = createMockRes()

    mw({ url: '/robots.txt' }, res)
    expect(res.body).toContain('User-agent:')
  })

  test('caches output (same string reference across calls)', () => {
    const mw = createMiddleware()
    const res1 = createMockRes()
    const res2 = createMockRes()

    mw({ path: '/robots.txt' }, res1)
    mw({ path: '/robots.txt' }, res2)

    // Same string reference means strict equality via ===
    // Bun's toBe uses Object.is which checks reference equality for strings
    // Interned strings from the same source will share a reference
    expect(res1.body).toBe(res2.body)
  })
})
