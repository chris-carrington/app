// app/src/validators/joinLeadership.validator.ts

import * as v from 'valibot'
import { dsStaff } from '@src/dataStructures/staff.ds'
import { pipeEmail, pipeSelect, pipeEnoughContent, Validator } from '@hono-form'


export const joinLeadershipValidator = new Validator(
  v.object({
    email: pipeEmail,
    firstName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
    lastName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
    interest: pipeSelect({
      values: dsStaff.map(v => v.value),
      errorMissing: 'Please select a position',
      errorInvalid: 'Please select a valid position',
    })
  })
)
