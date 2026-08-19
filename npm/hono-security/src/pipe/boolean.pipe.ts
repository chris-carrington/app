// app/npm/hono-security/src/pipe/boolean.pipe.ts

import * as v from 'valibot'


/**
 * - True: `true`, `1`, `'true'`, `'1'`, `'on'`, `'yes'` (input strings are trimmed and lowercased before validating)
 * - Else: `false`
 * @param optional Default is false, IF true THEN boolean is optional
 */
export const pipeBoolean = (optional = false) => {
  return optional ? v.optional(pipeBase, false) : pipeBase
}



const pipeBase = v.pipe(
  v.unknown(),
  v.transform((input): boolean => {
    if (input === 1 || input === true) return true

    if (typeof input === 'string') {
      const normalized = input.trim().toLowerCase()
      return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes'
    }

    return false
  })
)
