import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'

export const contact = sqliteTable('Contact', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique(),
  sendNewsletter: integer('sendNewsletter', { mode: 'boolean' }).default(true),
  sendJobOpportunityEmails: integer('sendJobOpportunityEmails', { mode: 'boolean' }).default(false),
  phoneNumber: text('phoneNumber'),
  sendJobOpportunityTexts: integer('sendJobOpportunityTexts', { mode: 'boolean' }).default(false),
})

export const person = sqliteTable('Person', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  contactId: integer('contactId')
    .notNull()
    .references(() => contact.id, { onDelete: 'cascade' }),
})

export const contactUsMessage = sqliteTable('ContactUsMessage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
  personId: integer('personId')
    .notNull()
    .references(() => person.id, { onDelete: 'cascade' }),
})
