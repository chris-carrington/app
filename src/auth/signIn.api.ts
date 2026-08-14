// app/src/auth/signIn.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { SignInSchema } from '@src/auth/signIn.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', SignInSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      console.log('data', data)
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)

export default app
