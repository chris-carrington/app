// app/src/db/upsertPerson.ts

import { eq } from 'drizzle-orm'
import { person } from '@src/db/schema'
import type { Transaction } from '@src/db'


export async function upsertPerson(personData: { firstName: string, lastName: string }, contactId: number, tx: Transaction): Promise<number> {
  const existingPerson = await tx
    .select()
    .from(person)
    .where(eq(person.contactId, contactId))
    .get()

  if (existingPerson) { // update
    await tx
      .update(person)
      .set({ firstName: personData.firstName, lastName: personData.lastName })
      .where(eq(person.id, existingPerson.id))

    return existingPerson.id
  } else { // insert
    const [inserted] = await tx
      .insert(person)
      .values({ firstName: personData.firstName, lastName: personData.lastName, contactId })
      .returning({ id: person.id })

    return inserted.id
  }
}
