// app/src/auth/signOut.ts

import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { db, Session } from '@src/db'
import { env } from 'cloudflare:workers'
import { sessionCookieName } from '@src/lib/vars'
import { deleteCookie, getSignedCookie } from 'hono/cookie'


/**
 * - IF you want to sign the current user out THEN **do not pass a sessionId**
 * - IF you want to sign out a user that is not you THEN pass a sessionId
 */
export async function signOut(c: Context, sessionId?: string) {
  const currentSessionId = sessionId
    ? null
    : await getSignedCookie(c, env.COOKIE_SECRET, sessionCookieName)

  if (sessionId || currentSessionId) {
    await db.delete(Session) // delete session from db
      .where(eq(Session.id, Number(sessionId || currentSessionId)))

    if (currentSessionId) deleteCookie(c, sessionCookieName, { path: '/' }) // delete session in cookie
  }
}
