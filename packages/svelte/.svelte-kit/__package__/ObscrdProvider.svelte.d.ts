import { type ObscrdConfig } from '@obscrd/core'
import { type Snippet } from 'svelte'
interface Props {
  children?: Snippet
  seed?: string
  level?: ObscrdConfig['level']
  clipboard?: boolean
  devtools?: boolean
  honeypot?: boolean
  copyrightNotice?: string
  contentIdPrefix?: string
  onDevToolsDetected?: () => void
}
declare const ObscrdProvider: import('svelte').Component<Props, {}, ''>
type ObscrdProvider = ReturnType<typeof ObscrdProvider>
export default ObscrdProvider
//# sourceMappingURL=ObscrdProvider.svelte.d.ts.map
