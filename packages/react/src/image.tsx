import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

export interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

export function ProtectedImage({ src, alt, width, height, className, style }: ProtectedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      const w = width ?? img.naturalWidth
      const h = height ?? img.naturalHeight
      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)
      setLoaded(true)
    }
    img.src = src
  }, [src, width, height])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
      style={loaded ? style : { ...style, display: 'none' }}
      data-loading={loaded ? undefined : ''}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    />
  )
}
