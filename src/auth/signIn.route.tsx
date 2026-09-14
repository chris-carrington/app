// app/src/auth/signIn.route.tsx

import { Hono } from 'hono'
import { Field } from '@hono-form'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { onSignInSubmit } from '@hono-directives'


export default new Hono()
  .get('/', (c) => {
    const rpc = createRPC<AppType>()

    return c.render(
      <>
        <title>Shasta Trades · Sign In</title>

        <form data-directive={onSignInSubmit()} class="form-card bg-white">
          <div class="title">Sign In to your Shasta Trades account</div>

          <Field name="email" label="Email" type="email" prefix="sign-in" />

          <button class="primary" type="submit">Sign In</button>

          <a href={rpc['sign-up'].$url().href}>Don't have an account? Then click here to Sign Up!</a>
        </form>
      </>
    )
  })
