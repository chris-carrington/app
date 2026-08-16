// app/npm/hono-security/src/pipe/email.pipe.ts

import * as v from 'valibot'

export const pipeEmail = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Please provide an email'),
  v.email('Please provide a valid email address'),
  v.toLowerCase() // normalize to lowercase to avoid duplicate entries
)
