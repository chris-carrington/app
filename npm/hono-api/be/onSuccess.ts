// app/npm/hono-api/be/onSuccess.ts

import type { Context } from 'hono'
import type { ApiSuccess } from '../api.d'
import type { ContentfulStatusCode } from 'hono/utils/http-status'


/**
 * ### Create a success Hono JSON Response
 * @param c Hono context
 * @param options.data Optional, additional data to be sent: `{ success: true, ...options.data }`
 * @param options.status Optional, default is `200`, HTTP Response status number
 */
export function onSuccess<T_Data extends undefined | Record<string, unknown> = undefined>(
  c: Context,
  options?: {
    data?: T_Data,
    status?: ContentfulStatusCode,
  }
) {
  const response = (options?.data
    ? { success: true, ...options.data }
    : { success: true }) as ApiSuccess<T_Data>

  return c.json(response, options?.status ?? 200)
}
