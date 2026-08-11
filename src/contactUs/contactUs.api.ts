// app/src/contactUs/contactUs.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { ContactUsSchema } from './contactUs.validator'
import { db, upsertPerson, upsertContact, ContactUsMessage } from '@src/db'


const app = new Hono()

app.post(
  '/',
  vValidator('json', ContactUsSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      await db.transaction(async (tx) => { // atomic
        let contactId = await upsertContact(data, tx)
        let personId = await upsertPerson(data, contactId, tx)
        await tx.insert(ContactUsMessage).values({ message: data.message, personId })
      })
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)

export default app
