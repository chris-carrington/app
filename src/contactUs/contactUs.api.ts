// app/src/contactUs/contactUs.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { ContactUsSchema } from './contactUs.validator'
import { db, upsertPersonContact, ContactUsMessage } from '@src/db'


export default new Hono()
  .post(
    '/',
    vValidator('json', ContactUsSchema),
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(async (tx) => { // atomic
          const { personId } = await upsertPersonContact(tx, {
            person: { firstName: data.firstName, lastName: data.lastName },
            contact: { email: data.email }
          })

          await tx.insert(ContactUsMessage).values({ message: data.message, personId })
        })
      } catch (e) {
        return c.json({ success: false, error: String(e) }, 500)
      }

      return c.json({ success: true })
    }
  )
