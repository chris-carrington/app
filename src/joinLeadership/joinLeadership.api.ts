// app/src/joinLeadership/joinLeadership.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { JoinLeadershipSchema } from './joinLeadership.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', JoinLeadershipSchema),
  async (c) => {
    const data = c.req.valid('json')

    return c.json({ success: true, data })
  }
)

export default app
