import type { Snippet } from 'svelte'
interface Props {
  href: string
  children?: Snippet
  class?: string
  style?: string
  obfuscate?: boolean
  onclick?: (e: MouseEvent) => void
  target?: string
  rel?: string
  id?: string
}
declare const ProtectedLink: import('svelte').Component<Props, {}, ''>
type ProtectedLink = ReturnType<typeof ProtectedLink>
export default ProtectedLink
//# sourceMappingURL=ProtectedLink.svelte.d.ts.map
