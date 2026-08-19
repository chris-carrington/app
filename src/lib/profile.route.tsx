// app/src/lib/profile.route.tsx


import { Hono } from 'hono'
import { Style } from 'hono/css'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'


export default new Hono()
  .get('/', async (c) => {
    return c.render(
      <>
        <Style>{subPageHeroStyle}</Style>

        <div class="mastery">
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Profile</h1>
              <div class="sub-title">Welcome, to the authenticated space!</div>
            </div>
          </div>
        </div>
      </>
    )
  })
