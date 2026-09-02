// app/src/auth/getSession.ts

import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { env } from 'cloudflare:workers'
import { db, Person, Contact, Session } from '@src/db'
import { deleteCookie, getSignedCookie } from 'hono/cookie'
import { setSessionCookie } from '@src/auth/setSessionCookie'
import { msSessionMaxAge, sessionCookieName, sessionRenewalWindow } from '@src/lib/vars'



const defaultSessionVariant = 'just-session'



export async function getSession<V extends Variant = typeof defaultSessionVariant>(c: Context, variant?: V): Promise<GetSessionResult<V>> {
  const sessionId = await getSignedCookie(c, env.COOKIE_SECRET, sessionCookieName)

  if (!sessionId) { // no session in cookie
    return {
      status: 401,
      message: 'Please sign in!',
    }
  }

  if (isNaN(Number(sessionId))) { // session cookie is not a number
    return {
      status: 401,
      message: 'Please sign in b/c you cookies session_id is not a number',
    }
  }

  const now = Date.now()

  let session: undefined | typeof Session.$inferSelect = undefined
  let person: undefined | typeof Person.$inferSelect = undefined
  let contact: undefined | typeof Contact.$inferSelect = undefined


  switch (variant) {
    case 'include-person-and-contact': {
      const result = await db
        .select()
        .from(Session)
        .innerJoin(Person, eq(Session.personId, Person.id))
        .innerJoin(Contact, eq(Person.id, Contact.personId))
        .where(eq(Session.id, Number(sessionId)))
        .limit(1)
        .get()

      session = result?.Session
      person = result?.Person
      contact = result?.Contact
    } break
    case 'include-person': {
      const result = await db
        .select()
        .from(Session)
        .innerJoin(Person, eq(Session.personId, Person.id))
        .where(eq(Session.id, Number(sessionId)))
        .limit(1)
        .get()

      session = result?.Session
      person = result?.Person
    } break
    default: {
      session = await db
        .select()
        .from(Session)
        .where(eq(Session.id, Number(sessionId)))
        .limit(1)
        .get()
    } break
  }


  if (!session) { // session is not in db
    deleteCookie(c, sessionCookieName, { path: '/' })

    return {
      status: 401,
      message: 'Please sign in b/c the session w/in your cookies was deleted in our database'
    }
  }


  if (session.expiresAt.getTime() < now) { // session has expired
    const now = Date.now()
    deleteCookie(c, sessionCookieName, { path: '/' })

    return {
      status: 401,
      message: 'Please sign in b/c your session expired'
    }
  }


  if (session.expiresAt.getTime() - now < sessionRenewalWindow) { // session expiration is w/in renewal window
    const expiresAt = new Date(now + msSessionMaxAge)

    await db
      .update(Session)
      .set({ expiresAt })
      .where(eq(Session.id, session.id))

    await setSessionCookie(c, String(session.id))

    session.expiresAt = expiresAt
  }

  switch (variant) { // provide what's been requested
    case 'include-person-and-contact': return { response: { session, person, contact }, status: 200 } as GetSessionResult<V>
    case 'include-person': return { response: { session, person }, status: 200 } as GetSessionResult<V>
    default: return { response: { session }, status: 200 } as GetSessionResult<V>
  }
}


type Variant = 'just-session' | 'include-person' | 'include-person-and-contact'

type GetSessionResult<V extends Variant> =
  | { status: 401, message: string }
  | (
      V extends 'just-session'
        ? { status: 200, response: { session: typeof Session.$inferSelect } }
        : V extends 'include-person'
        ? { status: 200, response: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect } }
        : V extends 'include-person-and-contact'
        ? { status: 200, response: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect, contact: typeof Contact.$inferSelect } }
        : never
  )
