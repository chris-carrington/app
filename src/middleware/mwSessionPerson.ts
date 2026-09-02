// app/src/middleware/mwSessionPerson.ts

import { Session, Person } from '@src/db'
import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'


export const mwSessionPerson = createMiddleware<{ Variables: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect } }>(
  async (c, next) => {
    const result = await getSession(c, 'include-person')

    if (result.status !== 200) return c.json({ error: result.message }, result.status)

    c.set('session', result.response.session)
    c.set('person', result.response.person)

    await next()
  }
)
