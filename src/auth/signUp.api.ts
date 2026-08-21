// app/src/auth/signUp.api.ts

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { signIn } from './signIn'
import { db, Person, Contact } from '@src/db'
import { vValidator } from '@hono/valibot-validator'
import { SignUpSchema } from '@src/auth/signUp.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', SignUpSchema),
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
        if (e instanceof Error) {
          console.error('=== FULL ERROR ===');
          console.error('name:', e?.name);
          console.error('message:', e?.message);
          console.error('stack:', e?.stack);
          // If it's an Error with a `cause` property (common in fetch errors)
          console.error('cause:', e?.cause);
          // If it's a plain object, stringify it
          console.error('stringified:', JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
          // Also log the query parameters to verify they are correct
          console.error('email query param:', data.email);
        }
        return c.json({ success: false, error: String(e) }, 500);
      }
    }
  )
