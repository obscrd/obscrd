import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createSeed } from './seed'

const command = process.argv[2]

if (command === 'init') {
  const seed = createSeed()
  const envPath = join(process.cwd(), '.env')

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8')
    if (/^OBSCRD_SEED=/m.test(content)) {
      console.log('OBSCRD_SEED already exists in .env')
      process.exit(0)
    }
    writeFileSync(envPath, `${content.trimEnd()}\nOBSCRD_SEED=${seed}\n`)
  } else {
    writeFileSync(envPath, `OBSCRD_SEED=${seed}\n`)
  }

  console.log(`✓ Generated seed: ${seed}`)
  console.log('✓ Written to .env as OBSCRD_SEED')
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
  init    Generate a seed and write it to .env
  seed    Print a random seed

https://obscrd.dev`)
}
