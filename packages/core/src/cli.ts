import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createSeed } from './seed'

function seedExists(): string | null {
  const cwd = process.cwd()
  for (const file of ['.env.local', '.env']) {
    const full = join(cwd, file)
    if (existsSync(full)) {
      const content = readFileSync(full, 'utf-8')
      if (/^OBSCRD_SEED=/m.test(content)) return file
    }
  }
  return null
}

function resolveEnvPath(): { path: string; name: string } {
  const cwd = process.cwd()
  for (const file of ['.env.local', '.env']) {
    const full = join(cwd, file)
    if (existsSync(full)) return { path: full, name: file }
  }
  return { path: join(cwd, '.env'), name: '.env' }
}

const command = process.argv[2]

if (command === 'init') {
  const existing = seedExists()
  if (existing) {
    console.log(`OBSCRD_SEED already exists in ${existing}`)
    process.exit(0)
  }

  const seed = createSeed()
  const { path: envPath, name: envName } = resolveEnvPath()

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8')
    writeFileSync(envPath, `${content.trimEnd()}\nOBSCRD_SEED=${seed}\n`)
  } else {
    writeFileSync(envPath, `OBSCRD_SEED=${seed}\n`)
  }

  console.log(`✓ Generated seed: ${seed}`)
  console.log(`✓ Written to ${envName} as OBSCRD_SEED`)
  console.log(`
Add it to your provider:

  import { ObscrdProvider } from '@obscrd/react'

  <ObscrdProvider seed={process.env.OBSCRD_SEED}>
    {/* your app */}
  </ObscrdProvider>`)
} else if (command === 'seed') {
  console.log(createSeed())
} else {
  console.log(`obscrd — content protection toolkit

Commands:
  init    Generate a seed and write it to .env.local (or .env)
  seed    Print a random seed

https://obscrd.dev`)
}
