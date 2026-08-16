// app/src/joinNewsletter/joinNewsletter.validator.ts

import * as v from 'valibot'
import { pipeEmail, pipeLastName, pipeFirstName, createValidator, type InferValidator } from '@hono-security'


export const JoinNewsletterSchema = v.object({
  firstName: pipeFirstName,
  lastName: pipeLastName,
  email: pipeEmail,
})

export const joinNewsletterValidator = createValidator(JoinNewsletterSchema)

export type JoinNewsletterFormData = InferValidator<typeof joinNewsletterValidator>
