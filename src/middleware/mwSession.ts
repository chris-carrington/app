// app/src/middleware/mwSession.ts

import { Session } from '@src/db'
import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'


export const mwSession = createMiddleware<{ Variables: { session: typeof Session.$inferSelect } }>(
  async (c, next) => {
    const result = await getSession(c, 'just-session')

    if (result.status !== 200) return c.json({ error: result.message }, result.status)

    c.set('session', result.response.session)
    await next()
  }
)
