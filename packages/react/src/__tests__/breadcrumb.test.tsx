import { createElement } from 'react'
import { Breadcrumb } from '../breadcrumb'
import { renderWithProvider } from './render'
import { describe, expect, test } from 'bun:test'

describe('Breadcrumb', () => {
  test('renders a visually hidden span', () => {
    const container = renderWithProvider(createElement(Breadcrumb, { id: 'test-id' }))
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span?.style.position).toBe('absolute')
    expect(span?.style.overflow).toBe('hidden')
  })

  test('has data-obscrd-breadcrumb attribute', () => {
    const container = renderWithProvider(createElement(Breadcrumb, { id: 'test-id' }))
    const el = container.querySelector('[data-obscrd-breadcrumb="test-id"]')
    expect(el).not.toBeNull()
  })

  test('uses provided id prop', () => {
    const container = renderWithProvider(createElement(Breadcrumb, { id: 'custom-id' }))
    const el = container.querySelector('[data-obscrd-breadcrumb="custom-id"]')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('custom-id')
  })

  test('derives deterministic ID from seed when no id provided', () => {
    const container1 = renderWithProvider(createElement(Breadcrumb), 'same-seed')
    const container2 = renderWithProvider(createElement(Breadcrumb), 'same-seed')
    const el1 = container1.querySelector('[data-obscrd-breadcrumb]')
    const el2 = container2.querySelector('[data-obscrd-breadcrumb]')
    expect(el1).not.toBeNull()
    expect(el1?.getAttribute('data-obscrd-breadcrumb')).toBe(el2?.getAttribute('data-obscrd-breadcrumb'))
  })

  test('has aria-hidden true', () => {
    const container = renderWithProvider(createElement(Breadcrumb, { id: 'test' }))
    const el = container.querySelector('[aria-hidden="true"]')
    expect(el).not.toBeNull()
  })
})
