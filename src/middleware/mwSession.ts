// app/src/middleware/mwSession.ts

import { Session } from '@src/db'
import { onError } from '@hono-api/be'
import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'


export const mwSession = createMiddleware<{ Variables: { session: typeof Session.$inferSelect } }>(
  async (c, next) => {
    const res = await getSession(c, 'just-session')

    if (res.status !== 200) return onError(c, res)

    c.set('session', res.response.session)
    await next()
  }
)
