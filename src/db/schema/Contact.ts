// app/src/db/schema/Contact.ts

import { Person } from '@src/db'
import { text, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store contact details for each **Person** */
export const Contact = sqliteTable(
  'Contact',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    emailVerified: integer('emailVerified', { mode: 'boolean' }).default(false),
    sendNewsletter: integer('sendNewsletter', { mode: 'boolean' }).default(true),
    sendJobOpportunityEmails: integer('sendJobOpportunityEmails', { mode: 'boolean' }).default(false),
    phoneNumber: text('phoneNumber'),
    phoneNumberVerified: integer('phoneNumberVerified', { mode: 'boolean' }).default(false),
    sendJobOpportunityTexts: integer('sendJobOpportunityTexts', { mode: 'boolean' }).default(false),
  },
  (table) => [
    uniqueIndex('Contact__personId__unique').on(table.personId),
    uniqueIndex('Contact__email__unique').on(table.email),
  ])
