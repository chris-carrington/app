// app/src/middleware/mwSessionPerson.ts

import { Session, Person } from '@src/db'
import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'
import { beApiError } from '@src/apiError/beApiError'


export const mwSessionPerson = createMiddleware<{ Variables: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect } }>(
  async (c, next) => {
    const res = await getSession(c, 'include-person')

    if (res.status !== 200) return beApiError(c, res)

    c.set('session', res.response.session)
    c.set('person', res.response.person)

    await next()
  }
)
