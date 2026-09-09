// app/src/middleware/mwSessionPerson.ts

import { onError } from '@hono-api/be'
import { Session, Person } from '@src/db'
import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'


export const mwSessionPerson = createMiddleware<{ Variables: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect } }>(
  async (c, next) => {
    const res = await getSession(c, 'include-person')

    if (res.status !== 200) return onError(c, res)

    c.set('session', res.response.session)
    c.set('person', res.response.person)

    await next()
  }
)
