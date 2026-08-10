// app/src/db/upsertContact.ts

import { eq } from 'drizzle-orm'
import { Contact } from '@src/db'
import type { Transaction } from '@src/db'


export async function upsertContact(contactUsData: { firstName: string, lastName: string, email: string }, tx: Transaction): Promise<number> {
  const existingContact = await tx
    .select()
    .from(Contact)
    .where(eq(Contact.email, contactUsData.email))
    .get()

  if (existingContact) { // update
    const updateData: typeof Contact.$inferInsert = { email: contactUsData.email, sendNewsletter: true }

    await tx
      .update(Contact)
      .set(updateData)
      .where(eq(Contact.id, existingContact.id))

    return existingContact.id
  } else { // insert
    const newContact: typeof Contact.$inferInsert = { email: contactUsData.email, sendNewsletter: true }

    const [inserted] = await tx
      .insert(Contact)
      .values(newContact)
      .returning({ id: Contact.id })

    return inserted.id
  }
}
