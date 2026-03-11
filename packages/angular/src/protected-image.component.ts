import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core'

// ── Types ──

export type ObjectFit = 'fill' | 'cover' | 'contain' | 'none'

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

@Component({
  selector: 'obscrd-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error()) {
      <div
        role="img"
        [attr.aria-label]="alt()"
        [class]="className()"
        [style]="errorStyle()"
      >{{ alt() }}</div>
    } @else {
      <div #wrapper [class]="className()" [style]="wrapperStyle()">
        @if (!loaded()) {
          <style>{{ pulseCSS }}</style>
          <div
            [style]="skeletonStyle()"
            aria-busy="true"
            [attr.aria-label]="'Loading ' + alt()"
          ></div>
        }
        <canvas
          #canvas
          role="img"
          [attr.aria-label]="alt()"
          style="display:block;width:100%;height:100%"
          (contextmenu)="$event.preventDefault()"
          (dragstart)="$event.preventDefault()"
        ></canvas>
      </div>
    }
  `,
})
export class ProtectedImageComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly wrapperRef = viewChild<ElementRef<HTMLDivElement>>('wrapper')
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas')

  readonly src = input.required<string>()
  readonly alt = input.required<string>()
  readonly width = input<number | undefined>(undefined)
  readonly height = input<number | undefined>(undefined)
  readonly crossOrigin = input<'' | 'anonymous' | 'use-credentials' | undefined>(undefined)
  readonly objectFit = input<ObjectFit>('fill')
  readonly className = input<string | undefined>(undefined)

  readonly loaded = signal(false)
  readonly error = signal(false)
  readonly pulseCSS = pulseCSS

  readonly wrapperStyle = computed(() => {
    const w = this.width()
    const h = this.height()
    return ['position:relative', 'overflow:hidden', w != null ? `width:${w}px` : '', h != null ? `height:${h}px` : '']
      .filter(Boolean)
      .join(';')
  })

  readonly errorStyle = computed(() => {
    const w = this.width()
    const h = this.height()
    return [
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'color:#666',
      'font-size:0.875rem',
      'background:#f0f0f0',
      w != null ? `width:${w}px` : '',
      h != null ? `height:${h}px` : '',
    ]
      .filter(Boolean)
      .join(';')
  })

  readonly skeletonStyle = computed(() =>
    ['position:absolute', 'inset:0', 'background:#18181b', 'animation:obscrd-pulse 1.5s ease-in-out infinite'].join(
      ';',
    ),
  )

  private imgRef: HTMLImageElement | null = null

  constructor() {
    afterNextRender(() => {
      // Initial load + react to input changes
      effect(() => {
        // Track reactive inputs
        void this.src()
        void this.width()
        void this.height()
        void this.crossOrigin()
        void this.objectFit()
        this.loadImage()
      })
    })
  }

  private loadImage() {
    this.loaded.set(false)
    this.error.set(false)

    const canvas = this.canvasRef()?.nativeElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    const co = this.crossOrigin()
    if (co != null) img.crossOrigin = co

    img.onload = () => {
      this.imgRef = img
      const wrapper = this.wrapperRef()?.nativeElement
      const w = this.width() ?? wrapper?.clientWidth ?? img.naturalWidth
      const h = this.height() ?? wrapper?.clientHeight ?? img.naturalHeight
      canvas.width = w
      canvas.height = h
      fitImage(ctx, img, w, h, this.objectFit())

      if (co == null) {
        try {
          canvas.toDataURL()
        } catch {
          console.warn(
            `[obscrd] Canvas tainted by cross-origin image "${this.src()}". Add crossOrigin="anonymous" to obscrd-image.`,
          )
        }
      }

      this.loaded.set(true)
    }
    img.onerror = () => this.error.set(true)
    img.src = this.src()

    // ResizeObserver for CSS-driven sizing
    if (this.width() == null || this.height() == null) {
      const wrapper = this.wrapperRef()?.nativeElement
      if (wrapper) {
        const ro = new ResizeObserver((entries) => {
          const entry = entries[0]
          if (!entry) return
          const { width: w, height: h } = entry.contentRect
          if (w > 0 && h > 0) this.redraw(canvas, w, h)
        })
        ro.observe(wrapper)
        this.destroyRef.onDestroy(() => ro.disconnect())
      }
    }
  }

  private redraw(canvas: HTMLCanvasElement, w: number, h: number) {
    const img = this.imgRef
    if (!img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = w
    canvas.height = h
    ctx.clearRect(0, 0, w, h)
    fitImage(ctx, img, w, h, this.objectFit())
  }
}
