// app/src/api/signUp.api.ts

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { signIn } from '@src/auth/signIn'
import { db, Person, Contact } from '@src/db'
import { vValidator } from '@hono/valibot-validator'
import { signUpValidator } from '@src/validators/signUp.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', signUpValidator.schema),
    async (c) => {
      const data = c.req.valid('json')

      try {
        const contact = await db // get contact
          .select()
          .from(Contact)
          .where(eq(Contact.email, data.email))
          .limit(1)
          .get()

        if (!contact) { // IF new THEN add
          await db.transaction(async (tx) => {
            const person = await tx.insert(Person) // add Person
              .values({
                firstName: data.firstName,
                lastName: data.lastName,
              })
              .returning({ id: Person.id })
              .get()

            await tx // add Contact
              .insert(Contact)
              .values({
                personId: person.id,
                email: data.email,
                emailVerified: false,
                sendNewsletter: true,
              })
          })
        }

        const res = await signIn(data.email)

        return res.status === 200
          ? c.json({ success: true })
          : c.json({ success: false, error: res.message }, res.status)
      } catch (e) {
        console.error(e)
        return c.json({ success: false, error: 'An unexpected error happened' }, 500);
      }
    }
  )
