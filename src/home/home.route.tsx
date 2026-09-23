import Value from './Value'
import { Hono } from 'hono'
import Building from './Building'
import Hero from '@src/home/Hero'
import Mission from '@src/home/Mission'
import PatternFlow from './PatternFlow'
import { env } from 'cloudflare:workers'
import PatternConnect from './PatternConnect'
import { onHomeHashClick } from '@hono-directives'


export default new Hono()
  .get('/', async (c) => {
    const description = 'Shasta Trades is a Nonprofit, that provides affordable, high-quality, trade services to Siskiyou County. 💚'

    return c.render(
      <>
        <title>Shasta Trades · Home</title>
        <meta property="og:title" content="Shasta Trades · Home" />
        <meta property="og:url" content="https:/shastatrades.org" />
        <meta property="og:image" content={`${env.ORIGIN}/og/home.webp`} />
        <meta property="og:description" content={description} />
        <meta name="description" content={description} />

        <div data-directive={onHomeHashClick()}>
          <Hero />
          <Mission />
          <PatternFlow />
          <Value />
          <PatternConnect />
          <Building />
        </div>
      </>
    )
  })
