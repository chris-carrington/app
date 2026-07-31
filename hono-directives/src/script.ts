import fs from 'fs'
import path from 'path'

export function findDirectives(srcDir: string): { name: string; filePath: string }[] {
  const results: { name: string; filePath: string }[] = []
  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(srcDir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'directives') continue
      results.push(...findDirectives(fullPath))
    } else if (/\.directive\.(ts|tsx)$/.test(entry.name)) {
      // Extract the name: everything before .directive
      const name = entry.name.replace(/\.directive\.(ts|tsx)$/, '')
      results.push({ name, filePath: fullPath })
    }
  }
  return results
}

function generateIndexJS(directives: { name: string; filePath: string }[]): string {
  let code = `// Auto-generated – do not edit\n\n`
  for (const { name } of directives) {
    // name is already clean (e.g., "counterSolid")
    code += `export function ${name}(...args) {\n`
    code += `  return JSON.stringify({ name: '${name}', args })\n`
    code += `}\n\n`
  }
  return code
}

function generateIndexDTS(directives: { name: string; filePath: string }[]): string {
  let decl = `// Auto-generated – do not edit\n\n`
  decl += `type DirectiveArgs<T> = Parameters<T> extends [any, ...infer Rest] ? Rest : never\n\n`
  for (const { name, filePath } of directives) {
    const rel = path.relative(
      path.join(process.cwd(), 'hono-directives/src'),
      filePath
    ).replace(/\\/g, '/').replace(/\.(ts|tsx)$/, '')
    decl += `import type { default as ${name}Directive } from './${rel}'\n`
  }
  decl += `\n`
  for (const { name } of directives) {
    decl += `/** @see {@link ${name}Directive} */\n`
    decl += `export declare function ${name}(...args: DirectiveArgs<typeof ${name}Directive>): string\n`
  }
  return decl
}

export function writeGeneratedFiles(directives: { name: string; filePath: string }[]) {
  const baseDir = path.join(process.cwd(), 'hono-directives/dist')
  fs.mkdirSync(baseDir, { recursive: true })
  fs.writeFileSync(path.join(baseDir, 'index.js'), generateIndexJS(directives), 'utf-8')
  fs.writeFileSync(path.join(baseDir, 'index.d.ts'), generateIndexDTS(directives), 'utf-8')
}
