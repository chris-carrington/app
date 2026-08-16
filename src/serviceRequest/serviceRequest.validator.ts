// app/src/serviceRequest/serviceRequest.validator.ts

import * as v from 'valibot'
import { jsonTrades } from '@src/json/trades.json'
import { pipeEmail, pipeArray, pipeLastName, pipeFirstName, pipeEnoughContent, createValidator, type InferValidator } from '@hono-security'


export const ServiceRequestSchema = v.object({
  firstName: pipeFirstName,
  lastName: pipeLastName,
  email: pipeEmail,
  description: pipeEnoughContent({
    count: 9,
    error: 'Please enter at least 9 characters'
  }),
  trade: pipeArray({
    values: jsonTrades,
    errorMissing: 'Please select at least one trade',
    errorInvalid: 'Please select at least one valid trade',
  })
})

export const serviceRequestValidator = createValidator(ServiceRequestSchema)

export type ServiceRequestFormData = InferValidator<typeof serviceRequestValidator>
