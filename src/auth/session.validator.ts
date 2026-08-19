// app/src/auth/session.validator.ts

import * as v from 'valibot'
import { pipeBoolean, createValidator, type InferValidator } from '@hono-security'


export const SessionSchema = v.object({
  includePersonAndContact: pipeBoolean(true),
})

export const sessionValidator = createValidator(SessionSchema)

export type SessionFormData = InferValidator<typeof sessionValidator>
