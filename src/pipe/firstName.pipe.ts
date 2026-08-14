// app/src/pipe/firstName.pipe.ts

import * as v from 'valibot'

export const pipeFirstName = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, 'Please provide at least 2 characters')
)
