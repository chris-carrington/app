// app/src/api/profile.api.ts

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db, Person } from '@src/db'
import { env } from 'cloudflare:workers'
import { onError, onSuccess, validator } from '@hono-api/be'
import { mwSessionPerson } from '@src/middleware/mwSessionPerson'
import { profileUpdateValidator } from '@src/validators/profileUpdate.validator'


export default new Hono()
  .put(
    '/',
    mwSessionPerson,
    validator('form', profileUpdateValidator.schema),
    async (c) => {
      const person = c.get('person')
      const form = c.req.valid('form')

      const response: { imageId?: string } = {}

      try {
        const update: typeof Person.$inferInsert = { firstName: form.firstName, lastName: form.lastName }

        if (form.img) update.imageId = response.imageId = crypto.randomUUID()

        await db.update(Person) // update db
          .set(update)
          .where(eq(Person.id, person.id))

        if (response.imageId && form.img) { // update r2
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
