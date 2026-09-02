// app/src/validators/serviceRequest.validator.ts

import * as v from 'valibot'
import { jsonTrades } from '@src/json/trades.json'
import { pipeEmail, pipeArray, pipeEnoughContent, Validator } from '@hono-security'


export const serviceRequestValidator = new Validator(
  v.object({
    email: pipeEmail,
    firstName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
    lastName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
    description: pipeEnoughContent({ count: 9, error: 'Please enter at least 9 characters' }),
    trade: pipeArray({
      values: jsonTrades,
      errorMissing: 'Please select at least one trade',
      errorInvalid: 'Please select at least one valid trade',
    })
  })
)
