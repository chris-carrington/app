// app/src/pipe/lastName.pipe.ts

import * as v from 'valibot'

export const pipeLastName = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, 'Please enter at least 2 characters'),
  v.regex(/^[a-zA-Z\s\-']+$/, 'Please only include valid characters')
)
