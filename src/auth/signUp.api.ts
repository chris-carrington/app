// app/src/auth/signUp.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { SignUpSchema } from '@src/auth/signUp.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', SignUpSchema),
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
