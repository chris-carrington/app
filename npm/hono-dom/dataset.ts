// app/npm/hono-dom/dataset.ts

export function dataset(camel: string): Dataset {
  const kebab = camel.replace(/([A-Z])/g, '-$1').toLowerCase() // camelCase to kebab-case
  const domAttr = `data-${kebab}`

  return {
    camel, // ts dataset property
    query(value?: unknown) { // query selector
      return value != undefined ? `[${domAttr}="${value}"]` : `[${domAttr}]`
    },
    attr(value?: unknown) { // tsx
      return { [domAttr]: value ? String(value) : '' }
    },
  }
}

export type Dataset = {
  camel: string,
  query(value?: string | number): string,
  attr(value?: unknown): {
    [x: string]: string;
  }
}
