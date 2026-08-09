// app/src/db/upsertContact.ts

import { eq } from 'drizzle-orm'
import { contact } from '@src/db/schema'
import type { Transaction } from '@src/db'


export async function upsertContact(contactUsData: { firstName: string, lastName: string, email: string }, tx: Transaction): Promise<number> {
  const existingContact = await tx
    .select()
    .from(contact)
    .where(eq(contact.email, contactUsData.email))
    .get()

  if (existingContact) { // update
    const updateData: typeof contact.$inferInsert = { sendNewsletter: true }

    await tx
      .update(contact)
      .set(updateData)
      .where(eq(contact.id, existingContact.id))

    return existingContact.id
  } else { // insert
    const newContact: typeof contact.$inferInsert = { email: contactUsData.email, sendNewsletter: true }

    const [inserted] = await tx
      .insert(contact)
      .values(newContact)
      .returning({ id: contact.id })

    return inserted.id
  }
}
