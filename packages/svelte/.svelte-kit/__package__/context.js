import { getContext, setContext } from 'svelte'

const OBSCRD_KEY = Symbol('obscrd')
export function setObscrd(value) {
  setContext(OBSCRD_KEY, value)
}
export function getObscrd() {
  const ctx = getContext(OBSCRD_KEY)
  if (!ctx) throw new Error('getObscrd() must be used within an <ObscrdProvider>')
  return ctx
}
