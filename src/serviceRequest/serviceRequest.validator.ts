// app/src/serviceRequest/serviceRequest.validator.ts

import * as v from 'valibot'
import { pipeEmail } from '@src/pipe/email.pipe'
import { pipeArray } from '@src/pipe/array.pipe'
import { jsonTrades } from '@src/json/trades.json'
import { pipeLastName } from '@src/pipe/lastName.pipe'
import { pipeFirstName } from '@src/pipe/firstName.pipe'
import { pipeEnoughContent } from '@src/pipe/enoughContent.pipe'
import { createValidator, type InferValidator } from '@hono-security'


export const ServiceRequestSchema = v.object({
  firstName: pipeFirstName,
  lastName: pipeLastName,
  email: pipeEmail,
  description: pipeEnoughContent({
    count: 9,
    error: 'Please enter at least 9 characters'
  }),
  interest: pipeArray({
    values: jsonTrades,
    errorMissing: 'Please select at least one trade',
    errorInvalid: 'Please select at least one valid trade',
  })
})

export const serviceRequestValidator = createValidator(ServiceRequestSchema)

export type ServiceRequestFormData = InferValidator<typeof serviceRequestValidator>
