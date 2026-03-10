import { type CSSProperties, defineComponent, h, onMounted, onUnmounted, type PropType, ref, watch } from 'vue'

// ── Types ──

export type ObjectFit = 'fill' | 'cover' | 'contain' | 'none'

export interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  objectFit?: ObjectFit
  class?: string
  style?: CSSProperties
}

const pulseCSS = '@keyframes obscrd-pulse{0%,100%{opacity:1}50%{opacity:0.5}}'

// ── Helpers ──

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

export const ProtectedImage = defineComponent({
  name: 'ProtectedImage',
  props: {
    src: { type: String as PropType<string>, required: true },
    alt: { type: String as PropType<string>, required: true },
    width: { type: Number as PropType<number>, default: undefined },
    height: { type: Number as PropType<number>, default: undefined },
    crossOrigin: { type: String as PropType<'' | 'anonymous' | 'use-credentials'>, default: undefined },
    objectFit: { type: String as PropType<ObjectFit>, default: 'fill' },
    class: { type: String as PropType<string>, default: undefined },
    style: { type: Object as PropType<CSSProperties>, default: undefined },
  },
  setup(props) {
    const wrapperRef = ref<HTMLDivElement | null>(null)
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const imgRef = ref<HTMLImageElement | null>(null)
    const loaded = ref(false)
    const error = ref(false)
    let resizeObserver: ResizeObserver | undefined

    const redraw = (w: number, h: number) => {
      const canvas = canvasRef.value
      const img = imgRef.value
      if (!canvas || !img) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, w, h)
      fitImage(ctx, img, w, h, props.objectFit)
    }

    const loadImage = () => {
      loaded.value = false
      error.value = false
      imgRef.value = null

      const canvas = canvasRef.value
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      if (props.crossOrigin != null) img.crossOrigin = props.crossOrigin

      img.onload = () => {
        imgRef.value = img
        const w = props.width ?? wrapperRef.value?.clientWidth ?? img.naturalWidth
        const h = props.height ?? wrapperRef.value?.clientHeight ?? img.naturalHeight
        canvas.width = w
        canvas.height = h
        fitImage(ctx, img, w, h, props.objectFit)

        if (props.crossOrigin == null) {
          try {
            canvas.toDataURL()
          } catch {
            console.warn('[obscrd] Canvas tainted — set crossOrigin to enable full protection.')
          }
        }

        loaded.value = true
      }

      img.onerror = () => {
        error.value = true
      }

      img.src = props.src
    }

    const setupResizeObserver = () => {
      resizeObserver?.disconnect()
      if (props.width != null && props.height != null) return
      const wrapper = wrapperRef.value
      if (!wrapper) return
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) return
        const { width: w, height: h } = entry.contentRect
        if (w > 0 && h > 0) redraw(w, h)
      })
      resizeObserver.observe(wrapper)
    }

    onMounted(() => {
      loadImage()
      setupResizeObserver()
    })

    watch(
      () => [props.src, props.width, props.height, props.crossOrigin, props.objectFit],
      () => {
        loadImage()
        setupResizeObserver()
      },
    )

    onUnmounted(() => {
      resizeObserver?.disconnect()
    })

    return () => {
      if (error.value) {
        return h(
          'div',
          {
            role: 'img',
            'aria-label': props.alt,
            class: props.class,
            style: {
              ...props.style,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '0.875rem',
              background: '#f0f0f0',
              ...(props.width != null ? { width: `${props.width}px` } : {}),
              ...(props.height != null ? { height: `${props.height}px` } : {}),
            },
          },
          props.alt,
        )
      }

      const wrapperStyle: CSSProperties = {
        ...props.style,
        position: 'relative',
        overflow: 'hidden',
        ...(props.width != null ? { width: `${props.width}px` } : {}),
        ...(props.height != null ? { height: `${props.height}px` } : {}),
      }

      const children: ReturnType<typeof h>[] = []

      if (!loaded.value) {
        children.push(h('style', { innerHTML: pulseCSS }))
        children.push(
          h('div', {
            style: {
              position: 'absolute',
              inset: '0',
              background: '#18181b',
              borderRadius: props.style?.borderRadius,
              animation: 'obscrd-pulse 1.5s ease-in-out infinite',
            },
            'aria-busy': 'true',
            'aria-label': `Loading ${props.alt}`,
          }),
        )
      }

      children.push(
        h('canvas', {
          ref: canvasRef,
          role: 'img',
          'aria-label': props.alt,
          style: { display: 'block', width: '100%', height: '100%' },
          onContextmenu: (e: Event) => e.preventDefault(),
          onDragstart: (e: Event) => e.preventDefault(),
        }),
      )

      return h('div', { ref: wrapperRef, class: props.class, style: wrapperStyle }, children)
    }
  },
})
