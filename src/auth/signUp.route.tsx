// app/src/auth/signUp.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { authStyle } from '@src/auth'
import { Field } from '@hono-security'
import { signUp } from '@hono-directives'


const app = new Hono()

app.get('/', (c) => {
  return c.render(
    <>
      <Style>{authStyle}</Style>

      <form data-directive={signUp()} class="auth">
        <div class="title">Create your Shasta Trades account</div>

        <div class="two">
          <Field name="firstName" placeholder="First Name" type="text" prefix="sign-up"/>
          <Field name="lastName" placeholder="Last Name" type="text" prefix="sign-up" />
        </div>

        <Field name="email" placeholder="Email" type="email" prefix="sign-up" />

        <button type="submit">Sign Up</button>

        <a href="/sign-in">Have an account? Then click here to <strong>Sign In</strong>!</a>
      </form>
    </>
  )
})

export default app
