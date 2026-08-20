// app/src/db/schema/Person.ts

import { relations } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { Contact, Session, JobLead, StaffLead, MagicToken, ContactUsMessage, Job__Client, Person__StaffPosition } from '@src/db'


/** Store all people in our system (students, mentors, customers, Trustees, Board members, employees, vendors, etc.) */
export const Person = sqliteTable('Person', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})


export const PersonRelations = relations(Person, ({ one, many }) => ({
  contact: one(Contact, {
    fields: [Person.id],
    references: [Contact.personId],
  }),
  contactUsMessages: many(ContactUsMessage),
  jobsAsClient: many(Job__Client),
  jobLeads: many(JobLead),
  staffLeads: many(StaffLead),
  positions: many(Person__StaffPosition),
  sessions: many(Session),
  magicTokens: many(MagicToken),
}))
