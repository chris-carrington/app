import { Hono } from 'hono'
import Forms from './Forms'
import Nav from '@src/lib/Nav'
import Building from './Building'
import Hero from '@src/home/Hero'
import Mission from '@src/home/Mission'


const app = new Hono()

app.get('/', async (c) => {
  return c.render(
    <>
      <Nav />
      <Hero />
      <Mission />
      <Forms />
      <Building />
    </>
  )
})

export default app
