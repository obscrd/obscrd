#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')

function createSeed() {
  const { randomBytes } = require('node:crypto')
  return randomBytes(16).toString('hex')
}

const command = process.argv[2]

if (command === 'init') {
  const seed = createSeed()
  const envPath = join(process.cwd(), '.env')

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8')
    if (/^OBSCRD_SEED=/m.test(content)) {
      console.log('OBSCRD_SEED already exists in .env')
      process.exit(0)
    }
    writeFileSync(envPath, content.trimEnd() + '\nOBSCRD_SEED=' + seed + '\n')
  } else {
    writeFileSync(envPath, 'OBSCRD_SEED=' + seed + '\n')
  }

  console.log('✓ Generated seed: ' + seed)
  console.log('✓ Written to .env as OBSCRD_SEED')
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
  console.log('  init    Generate a seed and write it to .env')
  console.log('  seed    Print a random seed')
  console.log('')
  console.log('https://obscrd.dev')
}
