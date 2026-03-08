import { createElement } from 'react'
import { Breadcrumb } from '../breadcrumb'
import { render } from './render'
import { describe, expect, test } from 'bun:test'

describe('Breadcrumb', () => {
  test('renders a visually hidden span', () => {
    const container = render(createElement(Breadcrumb, { id: 'test-id' }))
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span?.style.position).toBe('absolute')
    expect(span?.style.overflow).toBe('hidden')
  })

  test('has data-obscrd-breadcrumb attribute', () => {
    const container = render(createElement(Breadcrumb, { id: 'test-id' }))
    const el = container.querySelector('[data-obscrd-breadcrumb="test-id"]')
    expect(el).not.toBeNull()
  })

  test('uses provided id prop', () => {
    const container = render(createElement(Breadcrumb, { id: 'custom-id' }))
    const el = container.querySelector('[data-obscrd-breadcrumb="custom-id"]')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('custom-id')
  })

  test('generates an ID when none provided', () => {
    const container = render(createElement(Breadcrumb))
    const el = container.querySelector('[data-obscrd-breadcrumb]')
    expect(el).not.toBeNull()
    expect(el?.getAttribute('data-obscrd-breadcrumb')).toBeTruthy()
  })

  test('has aria-hidden true', () => {
    const container = render(createElement(Breadcrumb, { id: 'test' }))
    const el = container.querySelector('[aria-hidden="true"]')
    expect(el).not.toBeNull()
  })
})
