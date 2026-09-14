// app/src/auth/signUp.route.tsx

import { Hono } from 'hono'
import { Field } from '@hono-form'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { onSignUpSubmit } from '@hono-directives'


export default new Hono()
  .get('/', (c) => {
    return c.render(
      <>
        <title>Shasta Trades · Sign Up</title>

        <form data-directive={onSignUpSubmit()} class="form-card bg-white">
          <div class="title">Create your Shasta Trades account</div>

          <div class="two">
            <Field name="firstName" label="First Name" type="text" prefix="sign-up"/>
            <Field name="lastName" label="Last Name" type="text" prefix="sign-up" />
          </div>

          <Field name="email" label="Email" type="email" prefix="sign-up" />

          <button class="primary" type="submit">Sign Up</button>

          <a href={createRPC<AppType>()['sign-in'].$url().href}>Have an account? Then click here to Sign In!</a>
        </form>
      </>
    )
  })
