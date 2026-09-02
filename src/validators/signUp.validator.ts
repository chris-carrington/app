// app/src/validators/signUp.validator.ts

import * as v from 'valibot'
import { pipeEmail, pipeEnoughContent, Validator } from '@hono-security'


export const signUpValidator = new Validator(
  v.object({
    email: pipeEmail,
    firstName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
    lastName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
  })
)
