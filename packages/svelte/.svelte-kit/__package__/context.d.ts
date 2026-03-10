import type { ObscrdConfig } from '@obscrd/core'
export interface ObscrdContextValue {
  readonly config: ObscrdConfig
}
export declare function setObscrd(value: ObscrdContextValue): void
export declare function getObscrd(): ObscrdContextValue
//# sourceMappingURL=context.d.ts.map
