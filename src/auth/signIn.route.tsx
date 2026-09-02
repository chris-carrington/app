// app/src/auth/signIn.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { rpcBE } from '@hono-rpc/be'
import { authStyle } from '@src/auth'
import { Field } from '@hono-security'
import type { AppType } from '@src/index'
import { formStyle } from '@src/lib/formStyle'
import { onSignInSubmit } from '@hono-directives'


export default new Hono()
  .get('/', (c) => {
    const rpc = rpcBE<AppType>()

    return c.render(
      <>
        <title>Shasta Trades · Sign In</title>
        <Style>{authStyle}</Style>
        <Style>{formStyle}</Style>

        <form data-directive={onSignInSubmit()} class="auth bg-white">
          <div class="title">Sign In to your Shasta Trades account</div>

          <Field name="email" placeholder="Email" type="email" prefix="sign-in" />

          <button class="primary" type="submit">Sign In</button>

          <a href={rpc['sign-up'].$url().href}>Don't have an account? Then click here to Sign Up!</a>
        </form>
      </>
    )
  })
