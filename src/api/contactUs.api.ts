// app/src/api/contactUs.api.ts

import { Hono } from 'hono'
import { serverErrorMessage } from '@src/lib/vars'
import { vValidator } from '@hono/valibot-validator'
import { db, putPersonContact, ContactUsMessage } from '@src/db'
import { contactUsValidator } from '@src/validators/contactUs.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', contactUsValidator.schema),
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
        console.error(e)
        return c.json({ success: false, error: serverErrorMessage }, 500)
      }

      return c.json({ success: true })
    }
  )
