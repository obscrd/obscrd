import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser'
import { obfuscateEmail } from '@obscrd/core'
import { ObscrdService } from './obscrd.service'
import { ProtectedLinkComponent } from './protected-link.component'
import { srOnly } from './styles'

// ── Helpers ──

function buildMailto(email: string, opts: { subject?: string; body?: string; cc?: string; bcc?: string }): string {
  const params = new URLSearchParams()
  if (opts.subject) params.set('subject', opts.subject)
  if (opts.body) params.set('body', opts.body)
  if (opts.cc) params.set('cc', opts.cc)
  if (opts.bcc) params.set('bcc', opts.bcc)
  const query = params.toString()
  return `mailto:${email}${query ? `?${query}` : ''}`
}

// ── Component ──

@Component({
  selector: 'obscrd-email',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProtectedLinkComponent],
  template: `
    @if (obfuscate()) {
      <style [innerHTML]="safeCss()"></style>
      <obscrd-link [href]="href()" [obfuscate]="obfuscate()" [className]="className()" [id]="emailId()">
        <span [attr.style]="srOnlyStyle">{{ displayLabel() }}</span>
        <span aria-hidden="true" [innerHTML]="safeHtml()"></span>
      </obscrd-link>
    } @else {
      <obscrd-link [href]="href()" [obfuscate]="false" [className]="className()" [id]="emailId()">
        {{ displayLabel() }}
      </obscrd-link>
    }
  `,
})
export class ProtectedEmailComponent {
  private readonly obscrd = inject(ObscrdService)
  private readonly sanitizer = inject(DomSanitizer)

  readonly email = input.required<string>()
  readonly label = input<string | undefined>(undefined)
  readonly className = input<string | undefined>(undefined)
  readonly obfuscate = input(true)
  readonly emailId = input<string | undefined>(undefined, { alias: 'id' })
  readonly subject = input<string | undefined>(undefined)
  readonly body = input<string | undefined>(undefined)
  readonly cc = input<string | undefined>(undefined)
  readonly bcc = input<string | undefined>(undefined)
  readonly target = input<string | undefined>(undefined)
  readonly rel = input<string | undefined>(undefined)

  readonly srOnlyStyle = srOnly

  private readonly result = computed(() => obfuscateEmail(this.email(), this.obscrd.config().seed))

  readonly href = computed(() =>
    buildMailto(this.email(), {
      subject: this.subject(),
      body: this.body(),
      cc: this.cc(),
      bcc: this.bcc(),
    }),
  )

  readonly safeHtml = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.result().html))

  readonly safeCss = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.result().css))

  readonly displayLabel = computed(() => this.label() ?? this.email())
}
