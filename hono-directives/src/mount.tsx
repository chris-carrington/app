// app/hono-directives/src/mount.tsx

type DirectiveFn = (element: Element, ...args: any[]) => void


const directiveModules = import.meta.glob<{ default: DirectiveFn }>(
  '../../**/*.directive.{ts,tsx}',
  { eager: false }
)


function buildRegistry() {
  const registry: Record<string, () => Promise<{ default: DirectiveFn }>> = {}
  for (const path in directiveModules) {
    const fileName = path.split('/').pop() || ''
    // Strip .directive.ts or .directive.tsx
    const name = fileName.replace(/\.directive\.(ts|tsx)$/, '')
    if (name) registry[name] = directiveModules[path]
  }
  return registry
}


async function applyDirectives() {
  const registry = buildRegistry()
  const elements = document.querySelectorAll<Element>('[data-directive]')

  for (const el of elements) {
    const raw = el.getAttribute('data-directive')
    if (!raw) continue

    let parsed: { name: string; args: any[] }
    try {
      parsed = JSON.parse(raw)
    } catch {
      console.warn(`Invalid JSON in data-directive: ${raw}`, el)
      continue
    }

    const { name, args = [] } = parsed
    const loader = registry[name]
    if (!loader) {
      console.warn(`Directive "${name}" not found for element`, el)
      continue
    }

    const mod = await loader()
    const directiveFn = mod.default
    if (typeof directiveFn === 'function') {
      directiveFn(el, ...args)
    }
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyDirectives)
} else {
  applyDirectives()
}
