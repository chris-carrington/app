// app/npm/hono-directives/src/plugin.ts

import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import { findDirectives, writeGeneratedFiles } from './script.ts'

// Helper to search multiple directories
function findDirectoriesToSearch(): string[] {
  const directories = []
  const cwd = process.cwd()

  // Define directories to search
  const dirsToSearch = ['src', 'npm']

  for (const dir of dirsToSearch) {
    const fullPath = path.join(cwd, dir)
    if (fs.existsSync(fullPath)) {
      directories.push(fullPath)
    }
  }

  return directories
}

export default function directivesPlugin(): Plugin {
  const generate = () => {
    const searchDirs = findDirectoriesToSearch()
    const allDirectives = []

    for (const dir of searchDirs) {
      const directives = findDirectives(dir)
      allDirectives.push(...directives)
    }

    if (allDirectives.length > 0) {
      writeGeneratedFiles(allDirectives)
    }
  }

  return {
    name: 'directives-gen',
    configResolved() { generate() },
    buildStart() { generate() },
    handleHotUpdate({ file, server }) {
      if (/\.directive\.(ts|tsx)$/.test(file)) {
        const searchDirs = findDirectoriesToSearch()
        const isInSearchDir = searchDirs.some(dir => file.startsWith(dir))

        if (isInSearchDir) {
          generate()

          // Invalidate all possible index files
          for (const dir of searchDirs) {
            const indexPath = path.join(dir, 'directives', 'index.ts')
            const mod = server.moduleGraph.getModuleById(indexPath)
            if (mod) server.moduleGraph.invalidateModule(mod)
          }
        }
      }
    },
  }
}
