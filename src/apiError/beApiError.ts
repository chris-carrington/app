import type { Context } from 'hono'

export function beApiError(c: Context, error: unknown) {
  console.error(error)
  return c.json({ success: false }, 500)
}
