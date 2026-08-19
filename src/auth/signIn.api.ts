// app/src/auth/signIn.api.ts

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { env } from 'cloudflare:workers'
import { vValidator } from '@hono/valibot-validator'
import { sendEmail, renderEmail } from '@hono-email'
import { db, Person, Contact, MagicToken } from '@src/db'
import { SignInSchema } from '@src/auth/signIn.validator'
import emailTemplate from '@src/emails/magicLink.html?raw'
import { createPassword, hashCreate, msMinute } from '@hono-security'


const app = new Hono()

app.post(
  '/',
  vValidator('json', SignInSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      const result = await db // get person + contact
        .select()
        .from(Person)
        .innerJoin(Contact, eq(Person.contactId, Contact.id))
        .where(eq(Contact.email, data.email))
        .limit(1)

      if (result.length !== 1) return c.json({ success: true }) // prevent email enumeration

      const { Person: person, Contact: contact } = result[0]
      const token = createPassword()
      const tokenHash = await hashCreate({ password: token })

      await db // insert magic token
        .insert(MagicToken)
        .values({
          personId: person.id,
          tokenHash,
          expiresAt: new Date(Date.now() + (msMinute * 15))
        })

      const magicLink = `${env.APP_URL}/magic-link?token=${token}`

      await sendEmail({
        to: contact.email,
        subject: 'Sign in!',
        from: 'support@shastatrades.org',
        html: renderEmail(emailTemplate, { magicLink, firstName: person.firstName, lastName: person.lastName })
      })
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)

export default app
