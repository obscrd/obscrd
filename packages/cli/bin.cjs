#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')

function createSeed() {
  const { randomBytes } = require('node:crypto')
  return randomBytes(16).toString('hex')
}

function seedExists() {
  const cwd = process.cwd()
  for (const file of ['.env.local', '.env']) {
    const full = join(cwd, file)
    if (existsSync(full)) {
      const content = readFileSync(full, 'utf8')
      if (/^OBSCRD_SEED=/m.test(content)) return file
    }
  }
  return null
}

function resolveEnvPath() {
  const cwd = process.cwd()
  // Prefer .env.local (Next.js, Vite), fall back to .env
  const candidates = ['.env.local', '.env']
  for (const file of candidates) {
    const full = join(cwd, file)
    if (existsSync(full)) return { path: full, name: file }
  }
  // Neither exists — create .env
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
    const content = readFileSync(envPath, 'utf8')
    writeFileSync(envPath, `${content.trimEnd()}\nOBSCRD_SEED=${seed}\n`)
  } else {
    writeFileSync(envPath, `OBSCRD_SEED=${seed}\n`)
  }

  console.log(`✓ Generated seed: ${seed}`)
  console.log(`✓ Written to ${envName} as OBSCRD_SEED`)
  console.log('')
  console.log('Add it to your provider:')
  console.log('')
  console.log("  import { ObscrdProvider } from '@obscrd/react'")
  console.log('')
  console.log('  <ObscrdProvider seed={process.env.OBSCRD_SEED}>')
  console.log('    {/* your app */}')
  console.log('  </ObscrdProvider>')
} else if (command === 'seed') {
  console.log(createSeed())
} else {
  console.log('obscrd — content protection toolkit')
  console.log('')
  console.log('Commands:')
  console.log('  init    Generate a seed and write it to .env.local (or .env)')
  console.log('  seed    Print a random seed')
  console.log('')
  console.log('https://obscrd.dev')
}
