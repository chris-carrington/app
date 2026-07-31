import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.render(
    <>
      <h1>About!</h1>
      <a href="/">Home</a>
    </>
  )
})

export default app
