// app/src/auth/signOut.route.tsx

import { Hono } from 'hono'
import { urlBE } from '@src/url/urlBE'
import { signOut } from '@src/auth/signOut'


export default new Hono()
  .get('/', async (c) => {
    await signOut(c)
    const redirect: string = urlBE()['sign-in'].$url().href
    return c.redirect(redirect)
  })
