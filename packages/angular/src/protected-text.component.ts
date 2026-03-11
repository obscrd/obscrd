import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser'
import { obfuscateText } from '@obscrd/core'
import { ObscrdService } from './obscrd.service'

// ── Component ──

@Component({
  selector: 'obscrd-text',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (obfuscate()) {
      <style [innerHTML]="safeCss()"></style>
      <span [innerHTML]="safeHtml()"></span>
    } @else {
      <ng-content />
    }
  `,
})
export class ProtectedTextComponent {
  private readonly obscrd = inject(ObscrdService)
  private readonly sanitizer = inject(DomSanitizer)

  readonly text = input.required<string>()
  readonly level = input<'light' | 'medium' | 'maximum' | undefined>(undefined)
  readonly className = input<string | undefined>(undefined)
  readonly obfuscate = input(true)
  readonly textId = input<string | undefined>(undefined, { alias: 'id' })

  private readonly result = computed(() => {
    const config = this.obscrd.config()
    const effectiveLevel = this.level() ?? config.level ?? 'medium'
    return obfuscateText(this.text(), { seed: config.seed, level: effectiveLevel })
  })

  readonly safeHtml = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.result().html))

  readonly safeCss = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.result().css))
}
