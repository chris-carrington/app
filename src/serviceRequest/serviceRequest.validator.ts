// app/src/serviceRequest/serviceRequest.validator.ts

import * as v from 'valibot'
import { pipeEmail } from '@src/pipe/email.pipe'
import { pipeSelect } from '@src/pipe/select.pipe'
import { pipeLastName } from '@src/pipe/lastName.pipe'
import { pipeFirstName } from '@src/pipe/firstName.pipe'
import { jsonServiceRequest } from '@src/json/serviceRequest.json'
import { createValidator, type InferValidator } from '@hono-security'


export const ServiceRequestSchema = v.object({
  firstName: pipeFirstName,
  lastName: pipeLastName,
  email: pipeEmail,
  interest: pipeSelect({
    values: jsonServiceRequest,
    errorMissing: 'Please select a service request',
    errorInvalid: 'Please select a valid service request',
  })
})

export const serviceRequestValidator = createValidator(ServiceRequestSchema)

export type ServiceRequestFormData = InferValidator<typeof serviceRequestValidator>
