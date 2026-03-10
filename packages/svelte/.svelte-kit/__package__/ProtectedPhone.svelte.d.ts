import type { Snippet } from 'svelte'
interface Props {
  phone: string
  label?: string
  class?: string
  style?: string
  sms?: boolean
  onclick?: (e: MouseEvent) => void
  obfuscate?: boolean
  id?: string
  target?: string
  rel?: string
  children?: Snippet
}
declare const ProtectedPhone: import('svelte').Component<Props, {}, ''>
type ProtectedPhone = ReturnType<typeof ProtectedPhone>
export default ProtectedPhone
//# sourceMappingURL=ProtectedPhone.svelte.d.ts.map
