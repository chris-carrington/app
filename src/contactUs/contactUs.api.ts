// app/src/contactUs/contactUs.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { ContactUsSchema } from './contactUs.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', ContactUsSchema),
  async (c) => {
    const data = c.req.valid('json')

    return c.json({ success: true, data })
  }
)

export default app
