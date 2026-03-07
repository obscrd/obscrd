import { useObscrdContext } from './provider'

/**
 * Access the Obscrd configuration and utilities
 */
export function useObscrd() {
  return useObscrdContext()
}

/**
 * Hook to create a protected copy handler for custom elements
 */
export function useProtectedCopy() {
  // TODO: Implement clipboard interception hook
  return {
    onCopy: (e: React.ClipboardEvent) => {
      e.preventDefault()
    },
  }
}
