import { useObscrdContext } from './provider'

export function useObscrd() {
  return useObscrdContext()
}

export function useProtectedCopy() {
  return {
    onCopy: (e: React.ClipboardEvent) => {
      e.preventDefault()
      e.clipboardData.setData('text/plain', '')
    },
  }
}
