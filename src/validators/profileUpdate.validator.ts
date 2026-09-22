// app/src/validators/profileUpdate.validator.ts

import * as v from 'valibot'
import { bytesMB, pipeBoolean, pipeEnoughContent, pipeFile, Validator } from '@hono-form'


const maxMB = 3


const base = v.object({
  firstName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
  lastName: pipeEnoughContent({ count: 2, error: 'Please provide at least 2 characters' }),
  img: pipeFile({
    optional: true,
    notFileError: 'Please provide an image',
    mimeType: [['image/webp'], 'Please provide a webp image'],
    maxSize: [maxMB * bytesMB, `Please provide an image that is ≤ ${maxMB} MB`],
  }),
})


export const profileUpdateValidatorForm = new Validator(v.object({
  ...base.entries,
  newsletter: v.array(pipeBoolean()),
}))


export const profileUpdateValidatorApi = new Validator(v.object({
  ...base.entries,
  newsletter: pipeBoolean(),
}))
