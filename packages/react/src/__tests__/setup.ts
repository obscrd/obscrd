import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
})

Object.defineProperty(globalThis, 'window', { value: dom.window, writable: true })
Object.defineProperty(globalThis, 'document', { value: dom.window.document, writable: true })
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, writable: true })
Object.defineProperty(globalThis, 'HTMLElement', { value: dom.window.HTMLElement, writable: true })
Object.defineProperty(globalThis, 'Element', { value: dom.window.Element, writable: true })
Object.defineProperty(globalThis, 'Node', { value: dom.window.Node, writable: true })
Object.defineProperty(globalThis, 'Event', { value: dom.window.Event, writable: true })
Object.defineProperty(globalThis, 'MutationObserver', { value: dom.window.MutationObserver, writable: true })
Object.defineProperty(globalThis, 'customElements', { value: dom.window.customElements, writable: true })
Object.defineProperty(globalThis, 'CustomEvent', { value: dom.window.CustomEvent, writable: true })
Object.defineProperty(globalThis, 'getComputedStyle', { value: dom.window.getComputedStyle, writable: true })
Object.defineProperty(globalThis, 'HTMLDivElement', { value: dom.window.HTMLDivElement, writable: true })
Object.defineProperty(globalThis, 'HTMLSpanElement', { value: dom.window.HTMLSpanElement, writable: true })
Object.defineProperty(globalThis, 'HTMLImageElement', { value: dom.window.HTMLImageElement, writable: true })
Object.defineProperty(globalThis, 'HTMLStyleElement', { value: dom.window.HTMLStyleElement, writable: true })
Object.defineProperty(globalThis, 'HTMLParagraphElement', { value: dom.window.HTMLParagraphElement, writable: true })
Object.defineProperty(globalThis, 'HTMLCanvasElement', { value: dom.window.HTMLCanvasElement, writable: true })
Object.defineProperty(globalThis, 'HTMLAnchorElement', { value: dom.window.HTMLAnchorElement, writable: true })

// Minimal ResizeObserver stub for tests
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
}
