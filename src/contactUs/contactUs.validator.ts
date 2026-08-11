// app/src/contactUs/contactUs.validator.ts

import * as v from 'valibot'
import { createValidator, type InferValidator } from '@hono-security'
import { pipeEmail, pipeLastName, pipeFirstName, pipeEnoughContent } from '@src/pipe'


export const ContactUsSchema = v.object({
  firstName: pipeFirstName,
  lastName: pipeLastName,
  email: pipeEmail,
  message: pipeEnoughContent({
    count: 9,
    error: 'Please enter at least 9 characters'
  })
})

export const contactUsValidator = createValidator(ContactUsSchema)

export type ContactUsFormData = InferValidator<typeof contactUsValidator>
