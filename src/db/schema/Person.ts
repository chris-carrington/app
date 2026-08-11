// app/src/db/schema/Person.ts

import { relations } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { Contact, StaffLead, JobLead, ContactUsMessage, Job__Client, Person__StaffPosition } from '@src/db'


/** Store all people in our system (students, mentors, customers, Trustees, Board members, employees, vendors, etc.) */
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
  jobLeads: many(JobLead),
  staffLeads: many(StaffLead),
  positions: many(Person__StaffPosition),
}))
