// app/src/api/profile.api.ts

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { Contact, db, Person } from '@src/db'
import { env } from 'cloudflare:workers'
import { onError, onSuccess, validator } from '@hono-api/be'
import { mwSessionPerson } from '@src/middleware/mwSessionPerson'
import { profileUpdateValidatorApi } from '@src/validators/profileUpdate.validator'


export default new Hono()
  .put(
    '/',
    mwSessionPerson,
    validator('form', profileUpdateValidatorApi.schema),
    async (c) => {
      const person = c.get('person')
      const form = c.req.valid('form')
      const response: { imageId?: string } = {}

      try {
        const update: typeof Person.$inferInsert = { firstName: form.firstName, lastName: form.lastName }

        if (form.img && env.ENVIRONMENT !== 'local') {
          update.imageId = response.imageId = crypto.randomUUID()
        }

        await db.transaction(async (tx) => {
          await tx.update(Person) // update Person
            .set(update)
            .where(eq(Person.id, person.id))

          await tx.update(Contact) // update Contact
            .set({ sendNewsletter: form.newsletter })
            .where(eq(Contact.personId, person.id))
        })

        if (response.imageId && form.img && env.ENVIRONMENT !== 'local') { // update r2
          await Promise.all([
            env.R2.delete(person.imageId + '.webp'),
            env.R2.put(response.imageId + '.webp', form.img)
          ])
        }

        return onSuccess(c, { data: response })
      } catch (e) {
        return onError(c, { e })
      }
    }
  )
