// app/src/db/queryContactUsMessages.ts

import { eq } from 'drizzle-orm'
import { db, Person, Contact, ContactUsMessage } from '@src/db'
import { prop, leftJoin, createParentShape, type InferQuery, epoch } from '@drizzle-compose'


function getBaseQuery() {
  return db
    .select({
      id: ContactUsMessage.id,
      message: ContactUsMessage.message,
      createdAt: ContactUsMessage.createdAt,

      personId: Person.id,
      personImageId: Person.imageId,
      personFirstName: Person.firstName,
      personLastName: Person.lastName,
      personIsActive: Person.isActive,

      contactId: Contact.id,
      contactEmail: Contact.email,
      contactEmailVerified: Contact.emailVerified,
      contactSendNewsletter: Contact.sendNewsletter,
      contactSendJobOpportunityEmails: Contact.sendJobOpportunityEmails,
      contactPhoneNumber: Contact.phoneNumber,
      contactPhoneNumberVerified: Contact.phoneNumberVerified,
      contactSendJobOpportunityTexts: Contact.sendJobOpportunityTexts,
    })
    .from(ContactUsMessage)
    .leftJoin(Person, eq(Person.id, ContactUsMessage.personId))
    .leftJoin(Contact, eq(Contact.personId, Person.id))
    .orderBy(ContactUsMessage.createdAt)
}


const parentShape = createParentShape(getBaseQuery)
  .fn(row => ({
    id: row.id,
    message: row.message,
    createdAt: epoch(row.createdAt),

    person: {
      id: prop(row.personId, Person.id),
      imageId: prop(row.personImageId, Person.imageId),
      firstName: prop(row.personFirstName, Person.firstName),
      lastName: prop(row.personLastName, Person.lastName),
      isActive: prop(row.personIsActive, Person.isActive),
      email: prop(row.contactEmail, Contact.email),
    },
  }))


/** Get all contact-us messages */
export async function queryContactUsMessages() {
  return leftJoin(await getBaseQuery(), {
    parent: { shape: parentShape },
  })
}


/** Get a contact-us message by id */
export async function queryContactUsMessage(id: number) {
  const rows = await getBaseQuery()
    .where(eq(ContactUsMessage.id, id))

  const [contactUsMessage] = leftJoin(rows, {
    parent: { shape: parentShape },
  })

  return contactUsMessage
}


export type QueryContactUsMessage = InferQuery<typeof queryContactUsMessage>


export type QueryContactUsMessages = InferQuery<typeof queryContactUsMessages>
