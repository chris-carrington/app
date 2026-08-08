import { Hono } from 'hono'
import Pattern from './Pattern'
import Building from './Building'
import Hero from '@src/home/Hero'
import Mission from '@src/home/Mission'
import db from '@src/db'
import { person } from '@src/db/schema'

const app = new Hono()

app.get('/', async (c) => {
  const description = 'Shasta Trades Nonprofit provide affordable, high-quality trade services, to our lovely Mount Shasta community. 💚'

  const result = await db.select().from(person)

  return c.render(
    <>
      <title>Shasta Trades · Home</title>
      <meta property="og:title" content="Shasta Trades · Home" />
      <meta property="og:url" content="https:/shastatrades.org" />
      <meta property="og:image" content="https://shastatrades.org/og/home.webp" />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />

      <Hero />
      <Mission />
      <Pattern />
      <Building />
      <div style="display:none" id="test">{JSON.stringify(result)}</div>
    </>
  )
})

export default app
