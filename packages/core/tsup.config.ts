import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
  },
  {
    entry: ['src/cli.ts'],
    format: ['cjs'],
    banner: { js: '#!/usr/bin/env node' },
    splitting: false,
    sourcemap: false,
    clean: false,
    treeshake: true,
    minify: false,
  },
])
