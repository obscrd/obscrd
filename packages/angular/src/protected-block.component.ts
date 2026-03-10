import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core'
import { createClipboardInterceptor } from '@obscrd/core'
import { ObscrdService } from './obscrd.service'

@Component({
  selector: 'obscrd-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #block [class]="className()">
      <ng-content />
    </div>
  `,
})
export class ProtectedBlockComponent {
  private readonly obscrd = inject(ObscrdService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly blockRef = viewChild<ElementRef<HTMLDivElement>>('block')

  readonly className = input<string | undefined>(undefined)

  constructor() {
    afterNextRender(() => {
      const config = this.obscrd.config()
      if (config.clipboard === false) return

      const el = this.blockRef()?.nativeElement
      if (!el) return

      const interceptor = createClipboardInterceptor(el)
      interceptor.attach()
      this.destroyRef.onDestroy(() => interceptor.detach())
    })
  }
}
