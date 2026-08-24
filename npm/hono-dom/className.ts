// app/npm/hono-dom/className.ts

export function className(className: string) {
  return {
    className,
    query: '.' + className
  }
}
