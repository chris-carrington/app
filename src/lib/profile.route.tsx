// app/src/lib/profile.route.tsx


import { Hono } from 'hono'
import { Style } from 'hono/css'
import { rpcBE } from '@hono-rpc/be'
import type { AppType } from '@src/index'
import { getSession } from '@src/auth/getSession'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'


export default new Hono()
  .get('/', async (c) => {
    const res = await getSession(c, 'include-person-and-contact')

    const redirect: string = rpcBE<AppType>()['sign-in'].$url().href

    return res.status === 401
      ? c.redirect(redirect)
      : c.render(
        <>
          <title>Shasta Trades · Profile</title>
          <Style>{subPageHeroStyle}</Style>

          <div class="profile">
            <div class="sub-page-hero">
              <div class="bg"></div>
              <div class="header">
                <h1>Profile</h1>
                <div class="sub-title">Welcome {res.response.person.firstName} {res.response.person.lastName}!</div>
              </div>
            </div>
          </div>
        </>
      )
  })
