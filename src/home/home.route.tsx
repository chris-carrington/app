import { Hono } from 'hono'
import Pattern from './Pattern'
import { Style } from 'hono/css'
import Building from './Building'
import Hero from '@src/home/Hero'
import Mission from '@src/home/Mission'
import { env } from 'cloudflare:workers'
import { formStyle } from '@src/lib/formStyle'


export default new Hono()
  .get('/', async (c) => {
    const description = 'Shasta Trades is a Nonprofit, that provides affordable, high-quality, trade services, to our lovely Mount Shasta community. 💚'

    return c.render(
      <>
        <title>Shasta Trades · Home</title>
        <meta property="og:title" content="Shasta Trades · Home" />
        <meta property="og:url" content="https:/shastatrades.org" />
        <meta property="og:image" content={`${env.ORIGIN}/og/home.webp`} />
        <meta property="og:description" content={description} />
        <meta name="description" content={description} />
        <Style>{formStyle}</Style>

        <Hero />
        <Mission />
        <Pattern />
        <Building />
      </>
    )
  })
