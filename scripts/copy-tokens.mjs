/**
 * Copies CSS asset files from src → dist after tsup build.
 *   - src/tokens   → dist/tokens   (primitive + semantic + theme variants)
 *   - src/styles   → dist/styles   (optional utility classes, e.g. layout.css)
 * tsup handles JS/TS; CSS files need a separate copy step.
 */
import { cpSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ── Tokens ──────────────────────────────────────────────────────
const tokensSrc  = join(root, 'src', 'tokens')
const tokensDest = join(root, 'dist', 'tokens')

mkdirSync(tokensDest, { recursive: true })
mkdirSync(join(tokensDest, 'themes'), { recursive: true })
cpSync(tokensSrc, tokensDest, { recursive: true })

console.log('✓ Token CSS files copied to dist/tokens')

// ── Styles (utility stylesheets) ────────────────────────────────
const stylesSrc  = join(root, 'src', 'styles')
const stylesDest = join(root, 'dist', 'styles')

mkdirSync(stylesDest, { recursive: true })
cpSync(stylesSrc, stylesDest, { recursive: true })

console.log('✓ Style CSS files copied to dist/styles')
