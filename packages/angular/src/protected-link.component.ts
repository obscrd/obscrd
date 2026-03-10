import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core'

@Component({
  selector: 'obscrd-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (obfuscate()) {
      <a
        [id]="linkId()"
        [href]="active() ? href() : '#'"
        [class]="className()"
        [style.cursor]="'pointer'"
        [target]="target()"
        [rel]="rel()"
        (mouseenter)="active.set(true)"
        (mouseleave)="active.set(false)"
        (focus)="active.set(true)"
        (blur)="active.set(false)"
      ><ng-content /></a>
    } @else {
      <a
        [id]="linkId()"
        [href]="href()"
        [class]="className()"
        [target]="target()"
        [rel]="rel()"
      ><ng-content /></a>
    }
  `,
})
export class ProtectedLinkComponent {
  readonly href = input.required<string>()
  readonly obfuscate = input(true)
  readonly className = input<string | undefined>(undefined)
  readonly linkId = input<string | undefined>(undefined, { alias: 'id' })
  readonly target = input<string | undefined>(undefined)
  readonly rel = input('noopener noreferrer')

  readonly active = signal(false)
}
