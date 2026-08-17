// app/src/auth/signIn.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { secWeek, jwtCreate, jwtValidate } from '@hono-security'
import { SignInSchema, SignInFormData } from '@src/auth/signIn.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', SignInSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      console.log('data', data)
      const jwt = await jwtCreate({ payload: data, ttl: secWeek })
      console.log('jwt', jwt)

      const validity = await jwtValidate<SignInFormData>({ jwt })
      console.log('validity', validity)
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)

export default app
