// app/src/lib/objectives.route.tsx


import { Hono } from 'hono'
import { Style } from 'hono/css'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'


const app = new Hono()

app.get('/', async (c) => {
  return c.render(
    <>
      <Style>{subPageHeroStyle}</Style>

      <div class="mastery">
        <div class="sub-page-hero">
          <div class="bg"></div>
          <div class="header">
            <h1>Objectives</h1>
            <div class="sub-title">Our objectives are publicly available here, we're making progress and we invite all to see, celebrate, and hold us accountable!</div>
          </div>
        </div>
      </div>
    </>
  )
})


export default app
