// app/src/pipe/email.pipe.ts

import * as v from 'valibot'

export const pipeEmail = v.pipe(
  v.string(),
  v.trim(),
  v.email('Please enter a valid email address')
)
