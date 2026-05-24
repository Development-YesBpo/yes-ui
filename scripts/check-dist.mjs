/**
 * Verifies the dist/ output after build.
 * Run after `pnpm build` to confirm the package exports are all present.
 * Used by CI and prepublishOnly.
 */
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const required = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/tokens/primitives.css',
  'dist/tokens/semantic.css',
  'dist/tokens/themes/light.css',
  'dist/tokens/themes/dark.css',
  'dist/styles/layout.css',
]

let failed = false

for (const rel of required) {
  const abs = join(__dirname, '..', rel)
  if (existsSync(abs)) {
    console.log(`✓ ${rel}`)
  } else {
    console.error(`✗ MISSING: ${rel}`)
    failed = true
  }
}

if (failed) {
  console.error('\nDist check failed — run `pnpm build` and try again.')
  process.exit(1)
} else {
  console.log('\nAll dist files present.')
}
