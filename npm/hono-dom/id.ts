// app/npm/hono-dom/id.ts

export function id(id: string): IdReturn {
  return {
    id,
    query: '#' + id
  }
}

export type IdReturn = {
  id: string,
  query: string,
}
