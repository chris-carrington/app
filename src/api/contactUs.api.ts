// app/src/api/contactUs.api.ts

import { Hono } from 'hono'
import { validator, onError, onSuccess } from '@hono-api/be'
import { db, putPersonContact, ContactUsMessage } from '@src/db'
import { contactUsValidator } from '@src/validators/contactUs.validator'


export default new Hono()
  .post(
    '/',
    validator('json', contactUsValidator.schema),
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(async (tx) => { // atomic
          const { personId } = await putPersonContact(tx, {
            person: { firstName: data.firstName, lastName: data.lastName },
            contact: { email: data.email }
          })

          await tx.insert(ContactUsMessage).values({ message: data.message, personId })
        })
      } catch (e) {
        return onError(c, { e })
      }

      return onSuccess(c)
    }
  )
