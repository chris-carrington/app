// app/src/joinNewsletter/joinNewsletter.api.ts

import { Hono } from 'hono'
import { db, putPersonContact } from '@src/db'
import { vValidator } from '@hono/valibot-validator'
import { JoinNewsletterSchema } from '@src/joinNewsletter/joinNewsletter.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', JoinNewsletterSchema),
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(async (tx) => { // atomic
          await putPersonContact(tx, {
            person: { firstName: data.firstName, lastName: data.lastName },
            contact: { email: data.email }
          })
        })
      } catch (e) {
        return c.json({ success: false, error: String(e) }, 500)
      }

      return c.json({ success: true })
    }
  )
