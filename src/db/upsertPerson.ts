// app/src/db/upsertPerson.ts

import { eq } from 'drizzle-orm'
import { Person } from '@src/db'
import type { Transaction } from '@src/db'


export async function upsertPerson(personData: { firstName: string, lastName: string }, contactId: number, tx: Transaction): Promise<number> {
  const existingPerson = await tx
    .select()
    .from(Person)
    .where(eq(Person.contactId, contactId))
    .get()

  if (existingPerson) { // update
    await tx
      .update(Person)
      .set({ firstName: personData.firstName, lastName: personData.lastName })
      .where(eq(Person.id, existingPerson.id))

    return existingPerson.id
  } else { // insert
    const [inserted] = await tx
      .insert(Person)
      .values({ firstName: personData.firstName, lastName: personData.lastName, contactId })
      .returning({ id: Person.id })

    return inserted.id
  }
}
