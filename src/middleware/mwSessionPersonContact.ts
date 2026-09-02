// app/src/middleware/mwSessionPersonContact.ts

import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'
import { Session, Person, Contact } from '@src/db'


export const mwSessionPersonContact = createMiddleware<{ Variables: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect, contact: typeof Contact.$inferSelect } }>(
  async (c, next) => {
    const result = await getSession(c, 'include-person-and-contact')

    if (result.status !== 200) return c.json({ error: result.message }, result.status)

    c.set('session', result.response.session)
    c.set('person', result.response.person)
    c.set('contact', result.response.contact)

    await next()
  }
)
