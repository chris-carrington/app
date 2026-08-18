// app/src/db/schema/JobLead.ts

import { sql, relations } from 'drizzle-orm'
import { Job, Person, LeadStatus, Trade__JobLead } from '@src/db'
import { text, index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store entries from our service request (job lead) form */
export const JobLead = sqliteTable(
  'JobLead',
  {
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
  },
  (table) => [
    index('JobLead__statusId__index').on(table.statusId),
    uniqueIndex('JobLead__jobId__unique').on(table.jobId),
  ])


export const JobLeadRelations = relations(JobLead, ({ one, many }) => ({
  person: one(Person, {
    fields: [JobLead.personId],
    references: [Person.id],
  }),
  status: one(LeadStatus, {
    fields: [JobLead.statusId],
    references: [LeadStatus.id],
  }),
  job: one(Job, {
    fields: [JobLead.jobId],
    references: [Job.id],
  }),
  trades: many(Trade__JobLead),
}))
