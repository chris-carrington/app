// app/src/joinNewsletter/joinNewsletter.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { JoinNewsletterSchema } from './joinNewsletter.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', JoinNewsletterSchema),
  async (c) => {
    const data = c.req.valid('json')

    return c.json({ success: true, data })
  }
)

export default app
