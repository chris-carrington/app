// app/src/auth/signIn.validator.ts

import * as v from 'valibot'
import { pipeEmail } from '@src/pipe'
import { createValidator, type InferValidator } from '@hono-security'


export const SignInSchema = v.object({
  email: pipeEmail,
})

export const signInValidator = createValidator(SignInSchema)

export type SignInFormData = InferValidator<typeof signInValidator>
