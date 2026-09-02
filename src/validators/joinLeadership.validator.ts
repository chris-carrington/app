// app/src/validators/joinLeadership.validator.ts

import * as v from 'valibot'
import { jsonStaff } from '@src/json/staff.json'
import { pipeEmail, pipeSelect, pipeEnoughContent, Validator } from '@hono-security'


export const joinLeadershipValidator = new Validator(
  v.object({
    email: pipeEmail,
    firstName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
    lastName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
    interest: pipeSelect({
      values: jsonStaff.map(v => v.value),
      errorMissing: 'Please select a position',
      errorInvalid: 'Please select a valid position',
    })
  })
)
