import { type CSSProperties, forwardRef, useCallback, useEffect, useRef, useState } from 'react'

export interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const pulseCSS = '@keyframes obscrd-pulse{0%,100%{opacity:1}50%{opacity:0.5}}'

export const ProtectedImage = forwardRef<HTMLCanvasElement, ProtectedImageProps>(function ProtectedImage(
  { src, alt, width, height, className, style },
  ref,
) {
  const innerRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const setRefs = useCallback(
    (node: HTMLCanvasElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  useEffect(() => {
    setLoaded(false)
    setError(false)

    const canvas = innerRef.current
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
    img.onerror = () => setError(true)
    img.src = src
  }, [src, width, height])

  if (error) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.875rem',
          background: '#f0f0f0',
          width: width ?? 200,
          height: height ?? 150,
        }}
      >
        {alt}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ ...style, position: 'relative', width: width ?? 200, height: height ?? 150, overflow: 'hidden' }}
    >
      {!loaded && <style dangerouslySetInnerHTML={{ __html: pulseCSS }} />}
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#18181b',
            borderRadius: style?.borderRadius,
            animation: 'obscrd-pulse 1.5s ease-in-out infinite',
          }}
          aria-busy="true"
          aria-label={`Loading ${alt}`}
        />
      )}
      <canvas
        ref={setRefs}
        role="img"
        aria-label={alt}
        style={{ display: 'block', width: '100%', height: '100%' }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  )
})

ProtectedImage.displayName = 'ProtectedImage'
