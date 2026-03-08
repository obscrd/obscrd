import { createElement } from 'react'
import { ProtectedImage } from '../image'
import { render } from './render'
import { describe, expect, test } from 'bun:test'

describe('ProtectedImage', () => {
  test('renders a canvas with role="img"', () => {
    const container = render(
      createElement(ProtectedImage, { src: '/photo.jpg', alt: 'A photo', width: 200, height: 100 }),
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
    expect(canvas?.getAttribute('role')).toBe('img')
  })

  test('has aria-label with alt text', () => {
    const container = render(createElement(ProtectedImage, { src: '/photo.jpg', alt: 'A photo' }))
    const canvas = container.querySelector('canvas')
    expect(canvas?.getAttribute('aria-label')).toBe('A photo')
  })

  test('does not render an img tag', () => {
    const container = render(createElement(ProtectedImage, { src: '/photo.jpg', alt: 'A photo' }))
    const img = container.querySelector('img')
    expect(img).toBeNull()
  })

  test('applies className', () => {
    const container = render(createElement(ProtectedImage, { src: '/photo.jpg', alt: 'A photo', className: 'my-img' }))
    const canvas = container.querySelector('.my-img')
    expect(canvas).not.toBeNull()
  })
})
