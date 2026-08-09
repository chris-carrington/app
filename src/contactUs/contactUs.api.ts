// app/src/contactUs/contactUs.api.ts

import db from '@src/db'
import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import type { ResultSet } from '@libsql/client/web'
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import { eq, type ExtractTablesWithRelations } from 'drizzle-orm'
import { person, contact, contactUsMessage } from '@src/db/schema'
import { ContactUsSchema, type ContactUsFormData } from './contactUs.validator'


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
        await tx.insert(contactUsMessage).values({ message: data.message, personId })
      })
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)


async function upsertContact(data: ContactUsFormData, tx: Transaction): Promise<number> {
  const existingContact = await tx
    .select()
    .from(contact)
    .where(eq(contact.email, data.email))
    .get()

  if (existingContact) { // update
    const updateData: typeof contact.$inferInsert = { sendNewsletter: true }

    await tx
      .update(contact)
      .set(updateData)
      .where(eq(contact.id, existingContact.id))

    return existingContact.id
  } else { // insert
    const newContact: typeof contact.$inferInsert = { email: data.email, sendNewsletter: true }

    const [inserted] = await tx
      .insert(contact)
      .values(newContact)
      .returning({ id: contact.id })

    return inserted.id
  }
}


async function upsertPerson(data: ContactUsFormData, contactId: number, tx: Transaction): Promise<number> {
  const existingPerson = await tx
    .select()
    .from(person)
    .where(eq(person.contactId, contactId))
    .get()

  if (existingPerson) { // update
    await tx
      .update(person)
      .set({ firstName: data.firstName, lastName: data.lastName })
      .where(eq(person.id, existingPerson.id))

    return existingPerson.id
  } else { // insert
    const [inserted] = await tx
      .insert(person)
      .values({ firstName: data.firstName, lastName: data.lastName, contactId })
      .returning({ id: person.id })

    return inserted.id
  }
}


type Transaction = SQLiteTransaction<'async', ResultSet, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>


export default app
