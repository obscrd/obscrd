import { ENVIRONMENT_INITIALIZER, type EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core'
import { type ObscrdOptions, ObscrdService } from './obscrd.service'

export function provideObscrd(options: ObscrdOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    ObscrdService,
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        inject(ObscrdService).configure(options)
      },
    },
  ])
}
