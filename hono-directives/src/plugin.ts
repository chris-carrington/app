// hono-directives/plugin.ts

import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import { findDirectives, writeGeneratedFiles } from './script'

export default function directivesPlugin(): Plugin {
  const srcDir = path.join(process.cwd(), 'src')

  const generate = () => {
    if (!fs.existsSync(srcDir)) return
    const directives = findDirectives(srcDir)
    writeGeneratedFiles(directives)
  }

  return {
    name: 'directives-gen',
    configResolved() { generate() },
    buildStart() { generate() },
    handleHotUpdate({ file, server }) {
      if (/\.directive\.(ts|tsx)$/.test(file)) {
        generate()
        const mod = server.moduleGraph.getModuleById(
          path.join(srcDir, 'directives', 'index.ts')
        )
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}
