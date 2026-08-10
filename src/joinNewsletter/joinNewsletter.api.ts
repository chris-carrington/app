// app/src/joinNewsletter/joinNewsletter.api.ts

import { Hono } from 'hono'
import { db } from '@src/db'
import { vValidator } from '@hono/valibot-validator'
import { upsertPerson, upsertContact } from '@src/db'
import { JoinNewsletterSchema } from '@src/joinNewsletter/joinNewsletter.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', JoinNewsletterSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      await db.transaction(async (tx) => { // atomic
        await upsertPerson(data, await upsertContact(data, tx), tx)
      })
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)

export default app
