// app/src/api/joinNewsletter.api.ts

import { Hono } from 'hono'
import { db, putPersonContact } from '@src/db'
import { vValidator } from '@hono/valibot-validator'
import { beApiError } from '@src/apiError/beApiError'
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
        return beApiError(c, e)
      }

      return c.json({ success: true })
    }
  )
