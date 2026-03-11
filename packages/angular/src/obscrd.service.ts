import { computed, DestroyRef, Injectable, inject, signal } from '@angular/core'
import { createSeed, detectDevTools, type ObscrdConfig } from '@obscrd/core'

// ── Types ──

export interface ObscrdOptions {
  seed?: string
  level?: ObscrdConfig['level']
  clipboard?: boolean
  devtools?: boolean
  honeypot?: boolean
  copyrightNotice?: string
  contentIdPrefix?: string
  onDevToolsDetected?: () => void
}

// ── Service ──

@Injectable({ providedIn: 'root' })
export class ObscrdService {
  private readonly destroyRef = inject(DestroyRef)
  private readonly options = signal<ObscrdOptions>({})
  private readonly fallbackSeed = createSeed()

  readonly config = computed<ObscrdConfig>(() => {
    const opts = this.options()
    return {
      seed: opts.seed ?? this.fallbackSeed,
      level: opts.level ?? 'medium',
      clipboard: opts.clipboard,
      devtools: opts.devtools,
      honeypot: opts.honeypot,
      copyrightNotice: opts.copyrightNotice,
      contentIdPrefix: opts.contentIdPrefix,
    }
  })

  configure(opts: ObscrdOptions) {
    this.options.set(opts)

    if (!opts.seed) {
      console.warn(
        '[obscrd] No seed provided — using a random seed. For deterministic obfuscation and SSR support, run: npx @obscrd/core init',
      )
    }

    if (opts.devtools) {
      const detector = detectDevTools(opts.onDevToolsDetected ?? (() => console.warn('[obscrd] DevTools detected')))
      detector.start()
      this.destroyRef.onDestroy(() => detector.stop())
    }
  }
}
