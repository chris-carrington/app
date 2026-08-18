// app/src/db/schema/Contact.ts

import { Person } from '@src/db'
import { relations } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store contact details for each **Person** */
export const Contact = sqliteTable('Contact', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).default(false),
  sendNewsletter: integer('sendNewsletter', { mode: 'boolean' }).default(true),
  sendJobOpportunityEmails: integer('sendJobOpportunityEmails', { mode: 'boolean' }).default(false),
  phoneNumber: text('phoneNumber'),
  phoneNumberVerified: integer('phoneNumberVerified', { mode: 'boolean' }).default(false),
  sendJobOpportunityTexts: integer('sendJobOpportunityTexts', { mode: 'boolean' }).default(false),
})


export const ContactRelations = relations(Contact, ({ one }) => ({
  person: one(Person, {
    fields: [Contact.id],
    references: [Person.contactId],
  }),
}))
