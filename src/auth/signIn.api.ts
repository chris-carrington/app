// app/src/auth/signIn.api.ts

import { Hono } from 'hono'
import { signIn } from './signIn'
import { vValidator } from '@hono/valibot-validator'
import { SignInSchema } from '@src/auth/signIn.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', SignInSchema),
    async (c) => {
      const res = await signIn(c.req.valid('json').email)

      return res.status === 200
        ? c.json({ success: true })
        : c.json({ success: false, error: res.message }, res.status)
    }
  )
