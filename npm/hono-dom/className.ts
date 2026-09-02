// app/npm/hono-dom/className.ts

export function className(className: string): ClassNameReturn {
  return {
    className,
    query: '.' + className
  }
}

export type ClassNameReturn = {
  className: string,
  query: string,
}
