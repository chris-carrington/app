// app/src/apiError/beApiError.ts

import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'


export function beApiError(c: Context, options?: { caughtError?: unknown, message?: string, status?: ContentfulStatusCode }) {
  if (options?.caughtError) console.error(options.caughtError)

  const status = options?.status ? options.status : 500
  const response = options?.message ? { success: false, message: options.message } : { success: false }

  return c.json(response, status)
}
