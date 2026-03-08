import type { ObscrdConfig } from '@obscrd/core'
import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { useObscrd, useProtectedCopy } from '../hooks'
import { ObscrdProvider } from '../provider'
import { describe, expect, test } from 'bun:test'

describe('useObscrd', () => {
  test('throws outside provider', () => {
    let error: Error | null = null

    function TestComponent() {
      try {
        // biome-ignore lint/correctness/useHookAtTopLevel: intentionally testing error case
        useObscrd()
      } catch (e) {
        error = e as Error
      }
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    const orig = console.error
    console.error = () => {}
    try {
      flushSync(() => {
        root.render(createElement(TestComponent))
      })
    } finally {
      console.error = orig
    }

    expect(error).not.toBeNull()
    expect((error as Error | null)?.message).toContain('useObscrdContext must be used within')
  })

  test('returns config inside provider', () => {
    let config: ObscrdConfig | null = null

    function TestComponent() {
      const ctx = useObscrd()
      config = ctx.config
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)
    flushSync(() => {
      root.render(createElement(ObscrdProvider, { seed: 'my-seed' }, createElement(TestComponent)))
    })

    expect(config).not.toBeNull()
    // biome-ignore lint/style/noNonNullAssertion: checked above
    expect(config!.seed).toBe('my-seed')
    // biome-ignore lint/style/noNonNullAssertion: checked above
    expect(config!.level).toBe('medium')
  })
})

describe('useProtectedCopy', () => {
  test('returns an object with onCopy', () => {
    let result: ReturnType<typeof useProtectedCopy> | null = null

    function TestComponent() {
      result = useProtectedCopy()
      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)
    flushSync(() => {
      root.render(createElement(TestComponent))
    })

    expect(result).not.toBeNull()
    // biome-ignore lint/style/noNonNullAssertion: checked above
    expect(typeof result!.onCopy).toBe('function')
  })
})
