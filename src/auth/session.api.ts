// app/src/auth/session.api.ts

import { Hono } from 'hono'
import * as v from 'valibot'
import { eq } from 'drizzle-orm'
import { urlBE } from '@src/url/urlBE'
import { env } from 'cloudflare:workers'
import { vValidator } from '@hono/valibot-validator'
import { msWeek, pipeBoolean } from '@hono-security'
import { db, Session, Person, Contact } from '@src/db'
import { deleteCookie, getSignedCookie } from 'hono/cookie'
import { setSessionCookie } from '@src/auth/setSessionCookie'


export default new Hono()
  .delete(
    '/:id',
    vValidator('param', v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
    })),
    async (c) => {
      await db.delete(Session) // delete session from db
        .where(eq(Session.id, Number(c.req.valid('param').id)))

      deleteCookie(c, 'session', { path: '/' }) // delete session in cookie

      return c.json({ success: true })
    }
  )
  .get(
    '/', 
    vValidator('query', v.object({
      includePersonAndContact: pipeBoolean(true),
    })),
    async (c) => {
      const { includePersonAndContact } = c.req.valid('query')

      const sessionId = await getSignedCookie(c, env.COOKIE_SECRET, 'session')

      if (!sessionId) return c.json({ success: false, error: 'unauthorized' }, 401)

      let session: null | typeof Session.$inferSelect = null
      let sessionWithPersonAndContact: null | { Session: typeof Session.$inferSelect, Person: typeof Person.$inferSelect, Contact: typeof Contact.$inferSelect } = null

      if (includePersonAndContact) {
        const result = await db
          .select()
          .from(Session)
          .innerJoin(Person, eq(Session.personId, Person.id))
          .innerJoin(Contact, eq(Person.contactId, Contact.id))
          .where(eq(Session.id, Number(sessionId)))
          .limit(1)
        
        if (result[0]) {
          session = result[0].Session
          sessionWithPersonAndContact = result[0]
        }
      } else {
        const result = await db // get session
          .select()
          .from(Session)
          .where(eq(Session.id, Number(sessionId)))
          .limit(1)

        if (result[0]) session = result[0]
      }

      const now = Date.now()

      if (!session || session.expiresAt.getTime() < now) { // IF db says `Session` is undefined OR expired THEN delete cookie and redirect to `/sign-in`
        deleteCookie(c, 'session', { path: '/' }) // delete cookie 
        const redirect: string = urlBE()['sign-in'].$url().href
        return c.redirect(redirect)
      }

      if (session.expiresAt.getTime() - now < msWeek) { // IF session expires in less than 1 week THEN extend to 9 weeks from now
        const expiresAt = new Date(now + msWeek * 9)

        await db // update db Session expiresAt
          .update(Session)
          .set({ expiresAt })
          .where(eq(Session.id, session.id))

        await setSessionCookie(c, String(session.id)) // update cookie maxAge

        session.expiresAt = expiresAt
      }

      return c.json({ success: true, response: sessionWithPersonAndContact ?? session })
    }
  )
