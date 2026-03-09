import { type CSSProperties, forwardRef, useCallback, useEffect, useRef, useState } from 'react'

export type ObjectFit = 'fill' | 'cover' | 'contain' | 'none'

export interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  objectFit?: ObjectFit
  className?: string
  style?: CSSProperties
}

const pulseCSS = '@keyframes obscrd-pulse{0%,100%{opacity:1}50%{opacity:0.5}}'

// ── drawImage with objectFit math ──

function fitImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
  fit: ObjectFit,
) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight

  if (fit === 'fill') {
    ctx.drawImage(img, 0, 0, canvasW, canvasH)
    return
  }

  if (fit === 'none') {
    const dx = (canvasW - iw) / 2
    const dy = (canvasH - ih) / 2
    ctx.drawImage(img, dx, dy)
    return
  }

  // cover or contain
  const scaleX = canvasW / iw
  const scaleY = canvasH / ih
  const scale = fit === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)

  const sw = canvasW / scale
  const sh = canvasH / scale

  if (fit === 'cover') {
    const sx = (iw - sw) / 2
    const sy = (ih - sh) / 2
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH)
  } else {
    const dw = iw * scale
    const dh = ih * scale
    const dx = (canvasW - dw) / 2
    const dy = (canvasH - dh) / 2
    ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh)
  }
}

// ── Component ──

export const ProtectedImage = forwardRef<HTMLCanvasElement, ProtectedImageProps>(function ProtectedImage(
  { src, alt, width, height, crossOrigin, objectFit = 'fill', className, style },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
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

  // Redraws the canvas at the given pixel dimensions
  const redraw = useCallback(
    (w: number, h: number) => {
      const canvas = innerRef.current
      const img = imgRef.current
      if (!canvas || !img) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, w, h)
      fitImage(ctx, img, w, h, objectFit)
    },
    [objectFit],
  )

  // Load image
  useEffect(() => {
    setLoaded(false)
    setError(false)
    imgRef.current = null

    const canvas = innerRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    if (crossOrigin != null) img.crossOrigin = crossOrigin

    img.onload = () => {
      imgRef.current = img

      // Determine canvas buffer size
      const w = width ?? wrapperRef.current?.clientWidth ?? img.naturalWidth
      const h = height ?? wrapperRef.current?.clientHeight ?? img.naturalHeight
      canvas.width = w
      canvas.height = h
      fitImage(ctx, img, w, h, objectFit)

      // Warn if the canvas got tainted (cross-origin without crossOrigin prop)
      if (crossOrigin == null) {
        try {
          canvas.toDataURL()
        } catch {
          console.warn(
            `[obscrd] Canvas tainted by cross-origin image "${src}". Add crossOrigin="anonymous" to ProtectedImage.`,
          )
        }
      }

      setLoaded(true)
    }
    img.onerror = () => setError(true)
    img.src = src
  }, [src, width, height, crossOrigin, objectFit])

  // ResizeObserver — re-draw when wrapper changes size (CSS-driven sizing)
  useEffect(() => {
    if (width != null && height != null) return // explicit dims, no need to observe

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width: w, height: h } = entry.contentRect
      if (w > 0 && h > 0) redraw(w, h)
    })
    ro.observe(wrapper)
    return () => ro.disconnect()
  }, [width, height, redraw])

  const wrapperStyle: CSSProperties = {
    ...style,
    position: 'relative',
    overflow: 'hidden',
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
  }

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
          ...(width != null ? { width } : {}),
          ...(height != null ? { height } : {}),
        }}
      >
        {alt}
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className={className} style={wrapperStyle}>
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
