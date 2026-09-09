// app/npm/hono-api/be/validator.ts

import { onError } from './onError'
import type { ValidationTargets } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import type { GenericSchema, GenericSchemaAsync } from 'valibot'


/**
 * ### `vValidator` + returns our standard API error on validation failure (adds issues to data)
 *
 * @param target  - 'json', 'query', 'param', etc.
 * @param schema  - Your Valibot schema
 * @param message - Custom error message (default: 'Validation failed')
 * @param status  - HTTP status (default: 400)
 *
 * @example
  ```ts
  app.post('/contact',
    validator('json', contactSchema, 'Invalid contact data'),
    async (c) => {
      const data = c.req.valid('json') // ✅ fully typed
    }
  )
  ```
 */
export function validator<
  T extends GenericSchema | GenericSchemaAsync,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
  message = 'Please provide valid data',
  status: 400 | 422 = 400
) {
  return vValidator(target, schema, (result, c) => {
    if (!result.success) {
      return onError(c, {
        message,
        status,
        data: { issues: result.issues }
      })
    }
  })
}
