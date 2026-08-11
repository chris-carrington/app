// app/src/joinLeadership/joinLeadership.validator.ts

import * as v from 'valibot'
import { jsonStaff } from '@src/json/staff.json'
import { createValidator, type InferValidator } from '@hono-security'
import { pipeEmail, pipeSelect, pipeLastName, pipeFirstName } from '@src/pipe'


export const JoinLeadershipSchema = v.object({
  firstName: pipeFirstName,
  lastName: pipeLastName,
  email: pipeEmail,
  interest: pipeSelect({
    values: jsonStaff,
    errorMissing: 'Please select a position',
    errorInvalid: 'Please select a valid position',
  })
})

export const joinLeadershipValidator = createValidator(JoinLeadershipSchema)

export type JoinLeadershipFormData = InferValidator<typeof joinLeadershipValidator>
