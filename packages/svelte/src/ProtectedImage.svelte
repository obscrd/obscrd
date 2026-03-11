<script lang="ts">
  // ── Types ──

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

  let {
    src,
    alt,
    width,
    height,
    crossOrigin,
    objectFit = 'fill',
    class: className,
    style,
  }: Props = $props()

  // ── State ──

  let loaded = $state(false)
  let error = $state(false)
  let wrapperEl: HTMLDivElement | undefined = $state()
  let canvasEl: HTMLCanvasElement | undefined = $state()
  let imgRef: HTMLImageElement | null = null

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

  function redraw(w: number, h: number) {
    if (!canvasEl || !imgRef) return
    const ctx = canvasEl.getContext('2d')
    if (!ctx) return
    canvasEl.width = w
    canvasEl.height = h
    ctx.clearRect(0, 0, w, h)
    fitImage(ctx, imgRef, w, h, objectFit)
  }

  // ── Lifecycle ──

  let resizeObserver: ResizeObserver | undefined

  // Reload image when src or sizing props change
  $effect(() => {
    // Track reactive props
    void src
    void width
    void height
    void crossOrigin
    void objectFit

    // Only run after DOM is available
    if (!canvasEl) return

    loadImage()

    if (width == null || height == null) {
      if (wrapperEl) {
        resizeObserver?.disconnect()
        resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0]
          if (!entry) return
          const { width: w, height: h } = entry.contentRect
          if (w > 0 && h > 0) redraw(w, h)
        })
        resizeObserver.observe(wrapperEl)
      }
    }

    return () => {
      resizeObserver?.disconnect()
    }
  })

  function loadImage() {
    loaded = false
    error = false
    imgRef = null

    if (!canvasEl) return
    const ctx = canvasEl.getContext('2d')
    if (!ctx) return

    const img = new Image()
    if (crossOrigin != null) img.crossOrigin = crossOrigin

    img.onload = () => {
      imgRef = img
      const w = width ?? wrapperEl?.clientWidth ?? img.naturalWidth
      const h = height ?? wrapperEl?.clientHeight ?? img.naturalHeight
      canvasEl!.width = w
      canvasEl!.height = h
      fitImage(ctx, img, w, h, objectFit)

      if (crossOrigin == null) {
        try {
          canvasEl!.toDataURL()
        } catch {
          console.warn(
            `[obscrd] Canvas tainted by cross-origin image "${src}". Add crossOrigin="anonymous" to ProtectedImage.`,
          )
        }
      }

      loaded = true
    }
    img.onerror = () => { error = true }
    img.src = src
  }

  // ── Derived styles ──

  const wrapperStyle = $derived(
    [
      style ?? '',
      'position:relative;overflow:hidden',
      width != null ? `width:${width}px` : '',
      height != null ? `height:${height}px` : '',
    ]
      .filter(Boolean)
      .join(';'),
  )

  const errorStyle = $derived(
    [
      style ?? '',
      'display:flex;align-items:center;justify-content:center;color:#666;font-size:0.875rem;background:#f0f0f0',
      width != null ? `width:${width}px` : '',
      height != null ? `height:${height}px` : '',
    ]
      .filter(Boolean)
      .join(';'),
  )
</script>

{#if error}
  <div role="img" aria-label={alt} class={className} style={errorStyle}>
    {alt}
  </div>
{:else}
  <div bind:this={wrapperEl} class={className} style={wrapperStyle}>
    {#if !loaded}
      {@html `<style>${pulseCSS}</style>`}
      <div
        style="position:absolute;inset:0;background:#18181b;animation:obscrd-pulse 1.5s ease-in-out infinite"
        aria-busy="true"
        aria-label={`Loading ${alt}`}
      ></div>
    {/if}
    <canvas
      bind:this={canvasEl}
      role="img"
      aria-label={alt}
      style="display:block;width:100%;height:100%"
      oncontextmenu={(e) => e.preventDefault()}
      ondragstart={(e) => e.preventDefault()}
    ></canvas>
  </div>
{/if}
