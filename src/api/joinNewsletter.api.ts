// app/src/api/joinNewsletter.api.ts

import { Hono } from 'hono'
import { db, putPersonContact } from '@src/db'
import { serverErrorMessage } from '@src/lib/vars'
import { vValidator } from '@hono/valibot-validator'
import { joinNewsletterValidator } from '@src/validators/joinNewsletter.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', joinNewsletterValidator.schema),
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
        console.error(e)
        return c.json({ success: false, error: serverErrorMessage }, 500)
      }

      return c.json({ success: true })
    }
  )
