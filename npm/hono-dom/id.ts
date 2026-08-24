// app/npm/hono-dom/id.ts

export function id(id: string) {
  return {
    id,
    query: '#' + id
  }
}
