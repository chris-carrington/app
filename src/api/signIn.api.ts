// app/src/api/signIn.api.ts

import { Hono } from 'hono'
import { signIn } from '@src/auth/signIn'
import { validator, onError, onSuccess } from '@hono-api/be'
import { signInValidator } from '@src/validators/signIn.validator'


export default new Hono()
  .post(
    '/',
    validator('json', signInValidator.schema),
    async (c) => {
      const res = await signIn(c.req.valid('json').email)

      return res.status === 200
        ? onSuccess(c)
        : onError(c, res)
    }
  )
