// app/src/auth/signUp.validator.ts

import * as v from 'valibot'
import { pipeEmail, pipeLastName, pipeFirstName } from '@src/pipe'
import { createValidator, type InferValidator } from '@hono-security'


export const SignUpSchema = v.object({
  firstName: pipeFirstName,
  lastName: pipeLastName,
  email: pipeEmail,
})

export const signUpValidator = createValidator(SignUpSchema)

export type SignUpFormData = InferValidator<typeof signUpValidator>
