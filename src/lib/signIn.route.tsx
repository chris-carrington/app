// app/src/lib/signIn.route.tsx

import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.render(
    <>
      <h1 style="text-align: center;">Sign In</h1>
      <h1 style="text-align: center;">😅 Coming Soon!</h1>
    </>
  )
})

export default app
