// app/src/auth/guest.api.ts

import { Hono } from 'hono'
import { env } from 'cloudflare:workers'
import { getSignedCookie } from 'hono/cookie'


export default new Hono()
  .get('/', async (c) => {
    const sessionId = await getSignedCookie(c, env.COOKIE_SECRET, 'session')

    return sessionId
      ? c.json({ success: false, error: 'authenticated' }, 403)
      : c.json({ success: true })
  })
