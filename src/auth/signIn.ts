// app/src/auth/signIn.ts

import { eq } from 'drizzle-orm'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { sendEmail, renderEmail } from '@hono-email'
import { createPassword, hashCreate } from '@hono-form'
import { db, Person, Contact, MagicToken } from '@src/db'
import emailTemplate from '@src/emails/magicLink.html?raw'
import { emailFrom, magicTokenMaxAge, magicLinkTokenHashCreateProps } from '@src/lib/vars'


export async function signIn(email: string): Promise<SignInResult> {
  try {
    const resPersonContact = await db
      .select()
      .from(Person)
      .innerJoin(Contact, eq(Contact.personId, Person.id))
      .where(eq(Contact.email, email))
      .limit(1)
      .get()

    if (!resPersonContact) return { status: 200 } // prevent email enumeration

    const token = createPassword()
    const tokenHash = await hashCreate({ password: token, ...magicLinkTokenHashCreateProps })

    await db.transaction(async (tx) => {
      await tx
        .insert(MagicToken)
        .values({
          personId: resPersonContact.Person.id,
          tokenHash,
          expiresAt: new Date(Date.now() + magicTokenMaxAge),
        })

      const magicLink = createRPC<AppType>()['magic-link'][':token']
        .$url({ param: { token } })
        .href

      const resEmail = await sendEmail({
        from: emailFrom,
        to: resPersonContact.Contact.email,
        subject: 'Sign in!',
        html: renderEmail(emailTemplate, {
          magicLink,
          firstName: resPersonContact.Person.firstName,
          lastName: resPersonContact.Person.lastName,
        }),
      })

      if (!resEmail.success) {
        throw new Error(JSON.stringify(resEmail, null, 2))
      }
    })
  } catch (e) {
    console.error(e)
    return { status: 500, message: 'An error has occured' }
  }

  return { status: 200 }
}


type SignInResult = { status: 200 } | { status: 500, message: string }
