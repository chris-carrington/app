// app/src/auth/signIn.ts

import { eq } from 'drizzle-orm'
import { urlBE } from '@src/url/urlBE'
import { sendEmail, renderEmail } from '@hono-email'
import { db, Person, Contact, MagicToken } from '@src/db'
import emailTemplate from '@src/emails/magicLink.html?raw'
import { createPassword, hashCreate } from '@hono-security'
import { emailFrom, magicTokenMaxAge, magicLinkTokenHashCreateProps } from '@src/lib/vars'


export async function signIn(email: string): Promise<SignInResult> {
  try {
    const result = await db
      .select()
      .from(Person)
      .innerJoin(Contact, eq(Contact.personId, Person.id))
      .where(eq(Contact.email, email))
      .limit(1)
      .get()
console.log('result', result)
    if (!result) return { status: 200 } // prevent email enumeration

    const token = createPassword()
    const tokenHash = await hashCreate({ password: token, ...magicLinkTokenHashCreateProps }) // no salt makes the hash deterministic (db queryable) & 1 iteration is fine b/c this is a random password (hard to guess, not password123)

    await db // insert magic token
      .insert(MagicToken)
      .values({
        personId: result.Person.id,
        tokenHash,
        expiresAt: new Date(Date.now() + magicTokenMaxAge)
      })

    const magicLink = urlBE()['magic-link'][':token']
      .$url({ param: {token} })
      .href

    const res = await sendEmail({
      from: emailFrom,
      to: result.Contact.email,
      subject: 'Sign in!',
      html: renderEmail(emailTemplate, { magicLink, firstName: result.Person.firstName, lastName: result.Person.lastName })
    })
    console.log('res', res)
  } catch (e) {
    console.error(e)
    return { status: 500, message: 'An error has occured' }
  }

  return { status: 200 }
}


type SignInResult = { status: 200 } | { status: 500, message: string }
