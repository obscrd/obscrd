import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { deriveSeed } from '@obscrd/core'
import { ObscrdService } from './obscrd.service'
import { srOnly } from './styles'

@Component({
  selector: 'obscrd-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      aria-hidden="true"
      [attr.data-obscrd-breadcrumb]="contentId()"
      [attr.style]="srOnlyStyle"
    >{{ contentId() }}</span>
  `,
})
export class BreadcrumbComponent {
  private readonly obscrd = inject(ObscrdService)

  readonly breadcrumbId = input<string | undefined>(undefined, { alias: 'id' })

  readonly srOnlyStyle = srOnly

  readonly contentId = computed(() => {
    const id = this.breadcrumbId()
    if (id) return id
    return deriveSeed(this.obscrd.config().seed, 'breadcrumb').slice(0, 8)
  })
}
