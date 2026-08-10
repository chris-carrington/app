// app/src/joinLeadership/joinLeadership.validator.ts

import * as v from 'valibot'
import { jsonStaff } from '@src/json/staff.json'
import { pipeEmail } from '@src/pipe/email.pipe'
import { pipeSelect } from '@src/pipe/select.pipe'
import { pipeLastName } from '@src/pipe/lastName.pipe'
import { pipeFirstName } from '@src/pipe/firstName.pipe'
import { createValidator, type InferValidator } from '@hono-security'


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
