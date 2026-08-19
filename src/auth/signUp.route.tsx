// app/src/auth/signUp.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { authStyle } from '@src/auth'
import { Field } from '@hono-security'
import { urlBE } from '@src/url/urlBE'
import { onSignUpSubmit } from '@hono-directives'


export default new Hono()
  .get('/', (c) => {
    return c.render(
      <>
        <Style>{authStyle}</Style>

        <form data-directive={onSignUpSubmit()} class="auth">
          <div class="title">Create your Shasta Trades account</div>

          <div class="two">
            <Field name="firstName" placeholder="First Name" type="text" prefix="sign-up"/>
            <Field name="lastName" placeholder="Last Name" type="text" prefix="sign-up" />
          </div>

          <Field name="email" placeholder="Email" type="email" prefix="sign-up" />

          <button type="submit">Sign Up</button>

          <a href={urlBE()['sign-in'].$url().href}>Have an account? Then click here to Sign In!</a>
        </form>
      </>
    )
  })
