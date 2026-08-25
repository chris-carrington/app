// app/src/db/upsertPersonContact.ts

import { eq } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import { Person, Contact, type Transaction } from '@src/db'


export async function upsertPersonContact(tx: Transaction, data: UpsertPersonContactData): Promise<UpsertPersonContactResult> {
  let ids: Partial<UpsertPersonContactResult> = {
    personId: data.person?.id,
    contactId: data.contact?.id,
  }

  ids = await getIdsFromContactId(tx, ids)
  ids = await getIdsFromEmail(tx, ids, data)

  await updatePerson(tx, ids, data)
  await updateContact(tx, ids, data)

  ids = await insert(tx, ids, data)
  
  if (!ids.personId) throw new Error('!ids.personId')
  if (!ids.contactId) throw new Error('!ids.contactId')

  return { personId: ids.personId, contactId: ids.contactId }
}


async function getIdsFromContactId(tx: Transaction, ids: Partial<UpsertPersonContactResult>) {
  if (ids.contactId && !ids.personId) {
    const contact = await tx
      .select()
      .from(Contact)
      .where(eq(Contact.id, ids.contactId))
      .get()

    if (!contact) throw new Error(`Contact with id ${ids.contactId} not found in db`)

    ids.personId = contact.personId
  }

  return ids
}


async function getIdsFromEmail(tx: Transaction, ids: Partial<UpsertPersonContactResult>, data: UpsertPersonContactData) {
  if (data.contact?.email && (!ids.personId || !ids.contactId)) {
    const contact = await tx
      .select()
      .from(Contact)
      .where(eq(Contact.email, data.contact.email))
      .get()

    if (contact) {
      ids.contactId = contact.id
      ids.personId = contact.personId
    }
  }

  return ids
}


async function updatePerson(tx: Transaction, ids: Partial<UpsertPersonContactResult>, data: UpsertPersonContactData) {
  if (ids.personId && data.person) {
    const { id, ...personMinusId } = data.person

    await tx
      .update(Person)
      .set(personMinusId)
      .where(eq(Person.id, ids.personId))
  }
}


async function updateContact(tx: Transaction, ids: Partial<UpsertPersonContactResult>, data: UpsertPersonContactData) {
  if (ids.contactId && data.contact) {
    const { id, ...contactMinusId } = data.contact

    await tx
      .update(Contact)
      .set(contactMinusId)
      .where(eq(Contact.id, ids.contactId))
  }
}


async function insert(tx: Transaction, ids: Partial<UpsertPersonContactResult>, data: UpsertPersonContactData) {
  if (!ids.personId && data.person?.firstName && data.person.lastName) {
    const person = await tx
      .insert(Person)
      .values({ firstName: data.person.firstName, lastName: data.person.lastName })
      .returning({ id: Person.id })
      .get()

    ids.personId = person.id
  }

  if (!ids.contactId && ids.personId && data.contact?.email) {
    const contact = await tx
      .insert(Contact)
      .values({ personId: ids.personId, email: data.contact.email })
      .returning({ id: Contact.id })
      .get()

    ids.contactId = contact.id
  }

  return ids
}


type UpsertPersonContactData = {
  person?: Partial<InferSelectModel<typeof Person>>
  contact?: Partial<InferSelectModel<typeof Contact>>
}


type UpsertPersonContactResult = {
  personId: number
  contactId: number
}
