// app/src/contactUs/contactUs.validator.ts

import * as v from 'valibot'
import { pipeEmail } from '@src/pipe/email.pipe'
import { pipeLastName } from '@src/pipe/lastName.pipe'
import { pipeFirstName } from '@src/pipe/firstName.pipe'
import { pipeEnoughContent } from '@src/pipe/enoughContent.pipe'
import { createValidator, type InferValidator } from '@hono-security'


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
