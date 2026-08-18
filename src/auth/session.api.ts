// app/src/auth/session.api.ts

import { Hono } from 'hono'


const app = new Hono()

app.get(
  '/',
  async (c) => {
    await new Promise(resolve => setTimeout(resolve, 270))
    return c.json({ authenticated: true })
  }
)

export default app
