// app/src/db/schema/Person.ts

import { Contact } from './Contact'
import { relations } from 'drizzle-orm'
import { StaffLead } from './StaffLead'
import { ServiceLead } from './ServiceLead'
import { Job__Client } from './Job__Client'
import { StaffTemporal } from './StaffTemporal'
import { ContactUsMessage } from './ContactUsMessage'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store all people in our system (students, mentors, customers, trustees, board members, employees, vendors, etc.,) */
export const Person = sqliteTable('Person', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contactId: integer('contactId')
    .notNull()
    .references(() => Contact.id),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
})


export const PersonRelations = relations(Person, ({ one, many }) => ({
  contact: one(Contact, {
    fields: [Person.contactId],
    references: [Contact.id],
  }),
  contactUsMessages: many(ContactUsMessage),
  jobsAsClient: many(Job__Client),
  serviceLeads: many(ServiceLead),
  staffLeads: many(StaffLead),
  staffTemporals: many(StaffTemporal),
}))
