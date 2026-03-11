import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser'
import { obfuscatePhone } from '@obscrd/core'
import { ObscrdService } from './obscrd.service'
import { ProtectedLinkComponent } from './protected-link.component'
import { srOnly } from './styles'

@Component({
  selector: 'obscrd-phone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProtectedLinkComponent],
  template: `
    @if (obfuscate()) {
      <style [innerHTML]="safeCss()"></style>
      <obscrd-link [href]="href()" [obfuscate]="obfuscate()" [className]="className()" [id]="phoneId()">
        <span [attr.style]="srOnlyStyle">{{ displayLabel() }}</span>
        <span aria-hidden="true" [innerHTML]="safeHtml()"></span>
      </obscrd-link>
    } @else {
      <obscrd-link [href]="href()" [obfuscate]="false" [className]="className()" [id]="phoneId()">
        {{ displayLabel() }}
      </obscrd-link>
    }
  `,
})
export class ProtectedPhoneComponent {
  private readonly obscrd = inject(ObscrdService)
  private readonly sanitizer = inject(DomSanitizer)

  readonly phone = input.required<string>()
  readonly label = input<string | undefined>(undefined)
  readonly className = input<string | undefined>(undefined)
  readonly obfuscate = input(true)
  readonly phoneId = input<string | undefined>(undefined, { alias: 'id' })
  readonly sms = input(false)
  readonly target = input<string | undefined>(undefined)
  readonly rel = input<string | undefined>(undefined)

  readonly srOnlyStyle = srOnly

  private readonly result = computed(() => obfuscatePhone(this.phone(), this.obscrd.config().seed))

  readonly href = computed(() => (this.sms() ? `sms:${this.phone()}` : `tel:${this.phone()}`))

  readonly safeHtml = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.result().html))

  readonly safeCss = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.result().css))

  readonly displayLabel = computed(() => this.label() ?? this.phone())
}
