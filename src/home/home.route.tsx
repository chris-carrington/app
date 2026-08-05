import { Hono } from 'hono'
import Footer from './Footer'
import Nav from '@src/nav/Nav'
import Pattern from './Pattern'
import Menu from '@src/nav/Menu'
import Building from './Building'
import Hero from '@src/home/Hero'
import Mission from '@src/home/Mission'


const app = new Hono()

app.get('/', async (c) => {
  const description = 'We are dedicated to help students become licensed contractors through paid apprenticeships, to offer mentors work they love, and to provide affordable, high-quality trade services, to our lovely Mount Shasta community. 💚'

  return c.render(
    <>
      <title>Shasta Trades · Home</title>
      <meta charset="UTF-8" />
      <meta name="theme-color" content="#F9FBF9" />
      <meta property="og:title" content="Shasta Trades · Home" />
      <meta property="og:url" content="https:/shastatrades.org" />
      <meta property="og:image" content="https://shastatrades.org/og/home.webp" />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <Nav />
      <Menu />
      <Hero />
      <Mission />
      <Pattern />
      <Building />
      <Footer />
    </>
  )
})

export default app
