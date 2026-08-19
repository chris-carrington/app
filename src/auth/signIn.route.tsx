// app/src/auth/signIn.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { authStyle } from '@src/auth'
import { urlBE } from '@src/url/urlBE'
import { Field } from '@hono-security'
import { onSignInSubmit } from '@hono-directives'


export default new Hono()
  .get('/', (c) => {
    return c.render(
      <>
        <Style>{authStyle}</Style>

        <form data-directive={onSignInSubmit()} class="auth">
          <div class="title">Sign In to your Shasta Trades account</div>

          <Field name="email" placeholder="Email" type="email" prefix="sign-in" />

          <button type="submit">Sign In</button>

          <a href={urlBE()['sign-up'].$url().href}>Don't have an account? Then click here to Sign Up!</a>
        </form>
      </>
    )
  })
