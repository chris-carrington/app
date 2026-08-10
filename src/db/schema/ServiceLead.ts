// app/src/db/schema/ServiceLead.ts

import { Job } from './Job'
import { Trade } from './Trade'
import { sql } from 'drizzle-orm'
import { Person } from './Person'
import { relations } from 'drizzle-orm'
import { LeadStatus } from './LeadStatus'
import { Trade__ServiceLead } from './Trade__ServiceLead'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'


/** Store entries from our service request form */
export const ServiceLead = sqliteTable('ServiceLead', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  personId: integer('personId')
    .notNull()
    .references(() => Person.id),
  statusId: integer('statusId')
    .notNull()
    .references(() => LeadStatus.id),
  jobId: integer('jobId')
    .references(() => Job.id),
  description: text('description')
    .notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})


export const ServiceLeadRelations = relations(ServiceLead, ({ one, many }) => ({
  person: one(Person, {
    fields: [ServiceLead.personId],
    references: [Person.id],
  }),
  status: one(LeadStatus, {
    fields: [ServiceLead.statusId],
    references: [LeadStatus.id],
  }),
  job: one(Job, {
    fields: [ServiceLead.jobId],
    references: [Job.id],
  }),
  trades: many(Trade__ServiceLead),
}))