// app/npm/hono-email/src/build.mjs

import fs from 'fs'
import path from 'path'
import esbuild from 'esbuild'
import { fileURLToPath } from 'url'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '../dist')


// Clean dist
if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true })
fs.mkdirSync(distDir)


// renderEmail.ts → dist/renderEmail.js (ESM)
await esbuild.build({
  entryPoints: [path.join(__dirname, 'renderEmail.ts')],
  bundle: true,
  format: 'esm',
  outfile: path.join(distDir, 'renderEmail.js'),
  platform: 'browser',
  target: 'es2020',
})


console.log('✅ Build complete!')
console.log(`   - ${path.join(distDir, 'renderEmail.js')}`)
