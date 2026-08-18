// app/src/auth/signIn.api.ts

import { Hono } from 'hono'
import { env } from 'cloudflare:workers'
import { vValidator } from '@hono/valibot-validator'
import { sendEmail, renderEmail } from '@hono-email'
import emailTemplate from '@src/emails/magicLink.html?raw'
import { SignInSchema, type SignInFormData } from '@src/auth/signIn.validator'
import { secWeek, jwtCreate, jwtValidate, createPassword, hashCreate, hashValidate } from '@hono-security'


const app = new Hono()

app.post(
  '/',
  vValidator('json', SignInSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      console.log('data', data)

      const jwt = await jwtCreate({ payload: data, ttl: secWeek })
      console.log('jwt', jwt)

      const validity = await jwtValidate<SignInFormData>({ jwt })
      console.log('validity', validity)

      const signInPassword = createPassword()
      const hashedPassword = await hashCreate({ password: signInPassword })
      const hashValidateResponse = await hashValidate({ password: signInPassword, hash: hashedPassword })
      console.log('signInPassword', signInPassword)
      console.log('hashedPassword', hashedPassword)
      console.log('hashValidateResponse', hashValidateResponse)

      await sendEmail({
        accountId: env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: env.CLOUDFLARE_EMAIL_API_TOKEN,
        from: 'support@shastatrades.org',
        to: 'carrington.christopher@gmail.com',
        subject: 'Sign in!',
        html: renderEmail(emailTemplate, {
          firstName: 'Christopher',
          lastName: 'Carrington',
          magicLink: 'https://yahoo.com'
        })
      })
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)

export default app
