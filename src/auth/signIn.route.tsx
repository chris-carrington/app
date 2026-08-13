// app/src/auth/signIn.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { authStyle } from '@src/auth'
import { Field } from '@hono-security'
import { signIn } from '@hono-directives'


const app = new Hono()

app.get('/', (c) => {
  return c.render(
    <>
      <Style>{authStyle}</Style>

      <form data-directive={signIn()} class="auth">
        <div class="title">Sign In to your Shasta Trades account</div>

        <Field name="email" placeholder="Email" type="email" prefix="sign-in" />

        <button type="submit">Sign In</button>

        <a href="/sign-up">Don't have an account? Then click here to <strong>Sign Up</strong>!</a>
      </form>
    </>
  )
})

export default app
