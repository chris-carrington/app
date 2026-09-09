// app/npm/hono-api/be/onError.ts

import type { Context } from 'hono'
import type { ApiError } from '../api.d'
import type { ContentfulStatusCode } from 'hono/utils/http-status'


/**
 * ### Transmute an Error into a Hono JSON Response
 * @param c Hono context
 * @param options.e Optional, caught error from a try/catch, when truthy we will `console.error(options.e)`
 * @param options.message Optional, error message to be shown in toast notification
 * @param options.status Optional, default is `500`, HTTP Response status number
 * @param options.data Optional, additional data to be sent w/ error (e.g., valibot issues)
 */
export function onError<T_Data extends Record<string, unknown> | undefined = undefined>(
  c: Context,
  options?: {
    e?: unknown,
    data?: T_Data,
    message?: string,
    status?: ContentfulStatusCode,
  }
) {
  if (options?.e) console.error(options.e)

  const status = options?.status ?? 500
  const response = { success: false, ...options?.data } as ApiError<T_Data>
  if (options?.message) response.message = options.message

  return c.json(response, status)
}
