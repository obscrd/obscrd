import type { Snippet } from 'svelte'
interface Props {
  email: string
  label?: string
  class?: string
  style?: string
  subject?: string
  body?: string
  cc?: string
  bcc?: string
  onclick?: (e: MouseEvent) => void
  obfuscate?: boolean
  id?: string
  target?: string
  rel?: string
  children?: Snippet
}
declare const ProtectedEmail: import('svelte').Component<Props, {}, ''>
type ProtectedEmail = ReturnType<typeof ProtectedEmail>
export default ProtectedEmail
//# sourceMappingURL=ProtectedEmail.svelte.d.ts.map
