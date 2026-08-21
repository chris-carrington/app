// app/src/lib/profile.route.tsx


import { Hono } from 'hono'
import { Style } from 'hono/css'
import { urlBE } from '@src/url/urlBE'
import { getSession } from '@src/auth/getSession'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'


export default new Hono()
  .get('/', async (c) => {
    const res = await getSession(c, true)

    const redirect: string = urlBE()['sign-in'].$url().href

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
                <div class="sub-title">Welcome {res.response.Person.firstName} {res.response.Person.lastName}, to the authenticated space!</div>
              </div>
            </div>
          </div>
        </>
      )
  })
