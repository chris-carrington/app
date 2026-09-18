// app/npm/hono-directives/src/cli.ts
// Because honoDirectives() is a Vite plugin, its code generation only runs when Vite starts
// When we run a typecheck in production @hono-directives hasn't been generated yet because Vite hasn't run
// This script ensures generates @hono-directives from a cli context so our type check can work in production

import fs from 'fs'
import path from 'path'
import { findDirectives, writeGeneratedFiles } from './script.ts'


const searchDirs = ['src', 'npm']
  .map(dir => path.join(process.cwd(), dir))
  .filter(fullPath => fs.existsSync(fullPath))


const allDirectives = searchDirs.flatMap(dir => findDirectives(dir))

writeGeneratedFiles(allDirectives)

console.log('✅ @hono-directives built')
