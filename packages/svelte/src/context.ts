import type { ObscrdConfig } from '@obscrd/core'
import { getContext, setContext } from 'svelte'

const OBSCRD_KEY = Symbol('obscrd')

export interface ObscrdContextValue {
  readonly config: ObscrdConfig
}

export function setObscrd(value: ObscrdContextValue) {
  setContext(OBSCRD_KEY, value)
}

export function getObscrd(): ObscrdContextValue {
  const ctx = getContext<ObscrdContextValue>(OBSCRD_KEY)
  if (!ctx) throw new Error('getObscrd() must be used within an <ObscrdProvider>')
  return ctx
}
