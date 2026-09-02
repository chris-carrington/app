// app/src/auth/signOut.route.tsx

import { Hono } from 'hono'
import { rpcBE } from '@hono-rpc/be'
import type { AppType } from '@src/index'
import { signOut } from '@src/auth/signOut'


export default new Hono()
  .get('/', async (c) => {
    await signOut(c)
    const redirect: string = rpcBE<AppType>()['sign-in'].$url().href
    return c.redirect(redirect)
  })
