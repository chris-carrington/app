// app/src/serviceRequest/serviceRequest.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { ServiceRequestSchema } from './serviceRequest.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', ServiceRequestSchema),
  async (c) => {
    const data = c.req.valid('json')

    return c.json({ uccess: true, data })
  }
)

export default app
