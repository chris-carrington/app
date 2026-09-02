// app/src/api/signIn.api.ts

import { Hono } from 'hono'
import { signIn } from '@src/auth/signIn'
import { vValidator } from '@hono/valibot-validator'
import { signInValidator } from '@src/validators/signIn.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', signInValidator.schema),
    async (c) => {
      const res = await signIn(c.req.valid('json').email)

      return res.status === 200
        ? c.json({ success: true })
        : c.json({ success: false, error: res.message }, res.status)
    }
  )
