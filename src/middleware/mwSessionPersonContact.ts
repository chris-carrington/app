// app/src/middleware/mwSessionPersonContact.ts

import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'
import { Session, Person, Contact } from '@src/db'
import { beApiError } from '@src/apiError/beApiError'


export const mwSessionPersonContact = createMiddleware<{ Variables: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect, contact: typeof Contact.$inferSelect } }>(
  async (c, next) => {
    const res = await getSession(c, 'include-person-and-contact')

    if (res.status !== 200) return beApiError(c, res)

    c.set('session', res.response.session)
    c.set('person', res.response.person)
    c.set('contact', res.response.contact)

    await next()
  }
)
