import { createElement, createRef } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
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

  test('forwards ref to the canvas element', () => {
    const ref = createRef<HTMLCanvasElement>()
    render(createElement(ProtectedImage, { ref, src: '/photo.jpg', alt: 'A photo', width: 200, height: 100 }))
    expect(ref.current).toBeInstanceOf(HTMLCanvasElement)
  })

  test('shows loading skeleton before image loads', () => {
    const container = render(
      createElement(ProtectedImage, { src: '/photo.jpg', alt: 'A photo', width: 300, height: 200 }),
    )
    const skeleton = container.querySelector('[aria-busy="true"]')
    expect(skeleton).not.toBeNull()
    expect(skeleton?.getAttribute('aria-label')).toBe('Loading A photo')
    const style = container.querySelector('style')
    expect(style?.textContent).toContain('obscrd-pulse')
  })

  test('renders error fallback with alt text when image fails', async () => {
    // Mock canvas.getContext so the effect doesn't bail out early
    const origGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = () => ({ drawImage() {} }) as any

    // Mock Image to trigger onerror
    const OrigImage = globalThis.Image
    let errorCb: (() => void) | undefined
    globalThis.Image = class MockImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_: string) {
        errorCb = () => this.onerror?.()
      }
    } as any

    const container = document.createElement('div')
    const root = createRoot(container)
    flushSync(() => {
      root.render(
        createElement(ProtectedImage, {
          src: 'https://broken.invalid/nope.jpg',
          alt: 'Broken image',
          width: 400,
          height: 150,
        }),
      )
    })

    // Fire the error callback and flush React
    expect(errorCb).toBeDefined()
    flushSync(() => errorCb?.())

    const fallback = container.querySelector('[role="img"]')
    expect(fallback).not.toBeNull()
    expect(fallback?.textContent).toBe('Broken image')
    expect(fallback?.getAttribute('aria-label')).toBe('Broken image')

    // Restore
    globalThis.Image = OrigImage
    HTMLCanvasElement.prototype.getContext = origGetContext
  })

  test('crossOrigin prop is set on the internal Image before src', () => {
    const origGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = () => ({ drawImage() {}, clearRect() {} }) as any

    const OrigImage = globalThis.Image
    let capturedCrossOrigin: string | null = null
    globalThis.Image = class MockImage {
      crossOrigin: string | null = null
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_: string) {
        capturedCrossOrigin = this.crossOrigin
      }
    } as any

    render(
      createElement(ProtectedImage, {
        src: 'https://cdn.example.com/photo.jpg',
        alt: 'CDN photo',
        crossOrigin: 'anonymous',
        width: 200,
        height: 100,
      }),
    )

    expect(capturedCrossOrigin).toBe('anonymous')

    globalThis.Image = OrigImage
    HTMLCanvasElement.prototype.getContext = origGetContext
  })

  test('omits inline width/height when props not provided', () => {
    const container = render(createElement(ProtectedImage, { src: '/photo.jpg', alt: 'A photo' }))
    const wrapper = container.querySelector('[style]') as HTMLElement
    expect(wrapper).not.toBeNull()
    expect(wrapper?.style.width).toBe('')
    expect(wrapper?.style.height).toBe('')
  })

  test('sets inline width/height when props provided', () => {
    const container = render(
      createElement(ProtectedImage, { src: '/photo.jpg', alt: 'A photo', width: 300, height: 200 }),
    )
    const wrapper = container.querySelector('[style]') as HTMLElement
    expect(wrapper).not.toBeNull()
    expect(wrapper?.style.width).toBe('300px')
    expect(wrapper?.style.height).toBe('200px')
  })

  test('objectFit prop renders without error', () => {
    const container = render(
      createElement(ProtectedImage, {
        src: '/photo.jpg',
        alt: 'A photo',
        objectFit: 'cover',
        width: 200,
        height: 100,
      }),
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
  })
})
