type TextElement =
  | 'span'
  | 'p'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'li'
  | 'td'
  | 'th'
  | 'label'
  | 'legend'
  | 'caption'
  | 'blockquote'
  | 'figcaption'
  | 'strong'
  | 'em'
  | 'small'
  | 'mark'
  | 'cite'
  | 'abbr'
  | 'time'
  | 'address'
  | 'dt'
  | 'dd'
interface Props {
  text: string
  level?: 'light' | 'medium' | 'maximum'
  as?: TextElement
  class?: string
  obfuscate?: boolean
  id?: string
}
declare const ProtectedText: import('svelte').Component<Props, {}, ''>
type ProtectedText = ReturnType<typeof ProtectedText>
export default ProtectedText
//# sourceMappingURL=ProtectedText.svelte.d.ts.map
