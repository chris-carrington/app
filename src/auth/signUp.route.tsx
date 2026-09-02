// app/src/auth/signUp.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { rpcBE } from '@hono-rpc/be'
import { authStyle } from '@src/auth'
import { Field } from '@hono-security'
import type { AppType } from '@src/index'
import { formStyle } from '@src/lib/formStyle'
import { onSignUpSubmit } from '@hono-directives'


export default new Hono()
  .get('/', (c) => {
    return c.render(
      <>
        <title>Shasta Trades · Sign Up</title>
        <Style>{authStyle}</Style>
        <Style>{formStyle}</Style>

        <form data-directive={onSignUpSubmit()} class="auth bg-white">
          <div class="title">Create your Shasta Trades account</div>

          <div class="two">
            <Field name="firstName" placeholder="First Name" type="text" prefix="sign-up"/>
            <Field name="lastName" placeholder="Last Name" type="text" prefix="sign-up" />
          </div>

          <Field name="email" placeholder="Email" type="email" prefix="sign-up" />

          <button class="primary" type="submit">Sign Up</button>

          <a href={rpcBE<AppType>()['sign-in'].$url().href}>Have an account? Then click here to Sign In!</a>
        </form>
      </>
    )
  })
