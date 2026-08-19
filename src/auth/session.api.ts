// app/src/auth/session.api.ts

import { Hono } from 'hono'


export default new Hono()
  .get(
    '/',
    async (c) => {
      await new Promise(resolve => setTimeout(resolve, 450))
      return c.json({ authenticated: false })
    }
  )
