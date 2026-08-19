// app/src/auth/setSessionCookie.ts

import { Context } from 'hono'
import { env } from 'cloudflare:workers'
import { secWeek } from '@hono-security'
import { setSignedCookie } from 'hono/cookie'


export async function setSessionCookie(c: Context, sessionId: string) {
  const secExpiry = 9 * secWeek

  await setSignedCookie(c, 'session', sessionId, env.COOKIE_SECRET, { // update cookie
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    maxAge: secExpiry,
    secure: env.ENVIRONMENT === 'production',
  })
}
