import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser'
import { generateHoneypot } from '@obscrd/core'
import { ObscrdService } from './obscrd.service'

@Component({
  selector: 'obscrd-honeypot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [innerHTML]="safeHtml()"></div>`,
})
export class HoneypotComponent {
  private readonly obscrd = inject(ObscrdService)
  private readonly sanitizer = inject(DomSanitizer)

  readonly copyrightNotice = input<string | undefined>(undefined)
  readonly contentId = input<string | undefined>(undefined)

  readonly safeHtml = computed<SafeHtml>(() => {
    const config = this.obscrd.config()
    const html = generateHoneypot({
      contentId: this.contentId(),
      copyrightNotice: this.copyrightNotice() ?? config.copyrightNotice,
      seed: config.seed,
    })
    return this.sanitizer.bypassSecurityTrustHtml(html)
  })
}
