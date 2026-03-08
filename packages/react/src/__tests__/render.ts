import { createElement, type ReactElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { ObscrdProvider } from '../provider'

export function renderWithProvider(element: ReactElement, seed = 'test-seed') {
  const container = document.createElement('div')
  const root = createRoot(container)
  flushSync(() => {
    root.render(createElement(ObscrdProvider, { seed }, element))
  })
  return container
}

export function render(element: ReactElement) {
  const container = document.createElement('div')
  const root = createRoot(container)
  flushSync(() => {
    root.render(element)
  })
  return container
}
