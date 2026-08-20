// app/src/auth/getSession.ts

import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { env } from 'cloudflare:workers'
import { msWeek } from '@hono-security'
import { db, Person, Contact, Session } from '@src/db'
import { deleteCookie, getSignedCookie } from 'hono/cookie'
import { setSessionCookie } from '@src/auth/setSessionCookie'


export async function getSession<T_IncludePersonAndContact extends boolean>(
  c: Context,
  includePersonAndContact: T_IncludePersonAndContact
): Promise<GetSessionResult<T_IncludePersonAndContact>> {
  const sessionId = await getSignedCookie(c, env.COOKIE_SECRET, 'session')

  if (!sessionId) return { status: 401, message: 'Please sign in again, current cookies does not have a valid session' }

  let session: null | GetSessionResultBase['Session'] = null
  let sessionWithPersonAndContact: null | GetSessionResultFull = null

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
    return { status: 401, message: !session ? 'Please sign in again, previous session was been deleted within database' : 'Please sign in again, previous session expired' }
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

  if (sessionWithPersonAndContact) return { status: 200, response: sessionWithPersonAndContact } as GetSessionResult<T_IncludePersonAndContact>
  return { status: 200, response: { Session: session } } as GetSessionResult<T_IncludePersonAndContact>
}


/** Just `Session` */
type GetSessionResultBase = {
  Session: typeof Session.$inferSelect
}


/** Just `Session` + `Person` + `Contact` */
type GetSessionResultFull = GetSessionResultBase & {
  Person: typeof Person.$inferSelect
  Contact: typeof Contact.$inferSelect
}


/** `getSession()` return value */
type GetSessionResult<T_IncludePersonAndContact extends boolean> =
  | { status: 401; message: string }
  | (
      T_IncludePersonAndContact extends true
        ? { status: 200; response: GetSessionResultFull }
        : { status: 200; response: GetSessionResultBase }
    )
