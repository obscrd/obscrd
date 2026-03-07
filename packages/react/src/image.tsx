export interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function ProtectedImage({ src, alt, width, height, className }: ProtectedImageProps) {
  // TODO: Implement canvas-based image rendering
  return <img src={src} alt={alt} width={width} height={height} className={className} />
}
