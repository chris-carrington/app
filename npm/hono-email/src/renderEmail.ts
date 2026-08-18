// app/npm/hono-email/src/renderEmail.ts

/**
 * Supports:
 * - `<!-- add: path -->`
 * - `<!-- if: condition -->`
 * - `<!-- /if -->`
 * - `<!-- each: var of array -->`
 * - `<!-- /each -->`
 * @param template - raw HTML string
 * @param data - root data object
 * @returns rendered HTML string
 */
export function renderEmail(template: string, data: object): string {
  const ast = parse(template)
  return renderNodes(ast, [data])
}


type Node =
  | { type: 'text', content: string }
  | { type: 'add', path: string }
  | { type: 'if', condition: string, children: Node[] }
  | { type: 'each', varName: string, arrayPath: string, children: Node[] }


/**
 * Parse the template into an AST.
 */
function parse(template: string): Node[] {
  let i = 0

  const parseUntil = (endTag?: string): Node[] => {
    const result: Node[] = []

    while (i < template.length) {
      // Consume plain text
      if (!template.startsWith('<!--', i)) {
        let start = i
        while (i < template.length && !template.startsWith('<!--', i)) i++
        const text = template.slice(start, i)
        if (text) result.push({ type: 'text', content: text })
        continue
      }

      // Found a comment
      const close = template.indexOf('-->', i + 4)
      if (close === -1) break
      const comment = template.slice(i + 4, close).trim()
      i = close + 3

      // Check for closing tag
      if (comment.startsWith('/')) {
        const tag = comment.slice(1).trim()
        if (tag === endTag) return result
        // unknown closing tag – treat as text
        result.push({ type: 'text', content: `<!--${comment}-->` })
        continue
      }

      // Parse directive
      const parts = comment.split(/\s+/)
      let cmd = parts[0]
      if (cmd.endsWith(':')) cmd = cmd.slice(0, -1) // strip colon

      // For 'each', we need to parse "var of array"
      if (cmd === 'each') {
        // The rest of the comment after the command (e.g., "product of cart.items")
        const rest = parts.slice(1).join(' ')
        const ofIndex = rest.indexOf(' of ')
        if (ofIndex === -1) {
          // fallback: treat as old syntax (array path only, variable name = 'item')
          const arrayPath = rest.trim()
          const children = parseUntil('each')
          result.push({ type: 'each', varName: 'item', arrayPath, children })
        } else {
          const varName = rest.slice(0, ofIndex).trim()
          const arrayPath = rest.slice(ofIndex + 4).trim()
          const children = parseUntil('each')
          result.push({ type: 'each', varName, arrayPath, children })
        }
        continue
      }

      // Other directives (add, if)
      const path = parts[1]
      if (cmd === 'add') {
        result.push({ type: 'add', path })
      } else if (cmd === 'if') {
        const children = parseUntil('if')
        result.push({ type: 'if', condition: path, children })
      } else {
        // unknown directive – keep as text
        result.push({ type: 'text', content: `<!--${comment}-->` })
      }
    }

    return result
  }

  return parseUntil(undefined)
}

/**
 * Render an AST with a stack of data contexts.
 * The top of the stack is the current context.
 */
function renderNodes(nodes: Node[], dataStack: any[]): string {
  let output = ''

  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        output += node.content
        break

      case 'add': {
        const value = getValue(dataStack[0], node.path)
        output += value !== undefined ? String(value) : `{{${node.path}}}`
        break
      }

      case 'if': {
        if (getValue(dataStack[0], node.condition)) {
          output += renderNodes(node.children, dataStack)
        }
        break
      }

      case 'each': {
        const items = getValue(dataStack[0], node.arrayPath)
        if (Array.isArray(items)) {
          for (const item of items) {
            // Create a context with the dynamic variable name
            const context = { [node.varName]: item }
            output += renderNodes(node.children, [context, ...dataStack])
          }
        }
        break
      }
    }
  }

  return output
}

/**
 * Resolve a dotted path from an object.
 */
function getValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
