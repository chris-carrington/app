// app/src/auth/setSessionCookie.ts

import { Context } from 'hono'
import { env } from 'cloudflare:workers'
import { setSignedCookie } from 'hono/cookie'
import { secSessionMaxAge, sessionCookieName } from '@src/lib/vars'


export async function setSessionCookie(c: Context, sessionId: string) {
  await setSignedCookie(c, sessionCookieName, sessionId, env.COOKIE_SECRET, { // update cookie
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    maxAge: secSessionMaxAge,
    secure: env.ENVIRONMENT === 'production',
  })
}
