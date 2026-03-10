type ObjectFit = 'fill' | 'cover' | 'contain' | 'none'
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  objectFit?: ObjectFit
  class?: string
  style?: string
}
declare const ProtectedImage: import('svelte').Component<Props, {}, ''>
type ProtectedImage = ReturnType<typeof ProtectedImage>
export default ProtectedImage
//# sourceMappingURL=ProtectedImage.svelte.d.ts.map
