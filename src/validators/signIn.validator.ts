// app/src/validators/signIn.validator.ts

import * as v from 'valibot'
import { pipeEmail, Validator } from '@hono-security'


export const signInValidator = new Validator(
  v.object({
    email: pipeEmail,
  })
)
