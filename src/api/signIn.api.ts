// app/src/api/signIn.api.ts

import { Hono } from 'hono'
import { signIn } from '@src/auth/signIn'
import { vValidator } from '@hono/valibot-validator'
import { beApiError } from '@src/apiError/beApiError'
import { signInValidator } from '@src/validators/signIn.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', signInValidator.schema),
    async (c) => {
      const res = await signIn(c.req.valid('json').email)

      return res.status === 200
        ? c.json({ success: true })
        : beApiError(c, res)
    }
  )
