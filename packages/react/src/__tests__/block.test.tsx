import { createElement } from 'react'
import { ProtectedBlock } from '../block'
import { renderWithProvider } from './render'
import { describe, expect, test } from 'bun:test'

describe('ProtectedBlock', () => {
  test('renders children', () => {
    const container = renderWithProvider(
      createElement(ProtectedBlock, null, createElement('p', null, 'Protected content')),
    )
    const p = container.querySelector('p')
    expect(p).not.toBeNull()
    expect(p?.textContent).toBe('Protected content')
  })

  test('renders with given className', () => {
    const container = renderWithProvider(createElement(ProtectedBlock, { className: 'my-block' }, 'Content'))
    const el = container.querySelector('.my-block')
    expect(el).not.toBeNull()
  })
})
