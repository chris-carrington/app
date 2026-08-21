// app/src/db/schema/JobLead.ts

import { sql } from 'drizzle-orm'
import { Job, Person, LeadStatus } from '@src/db'
import { text, index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store entries from our service request (job lead) form */
export const JobLead = sqliteTable(
  'JobLead',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
    statusId: integer('statusId')
      .notNull()
      .references(() => LeadStatus.id),
    jobId: integer('jobId')
      .references(() => Job.id, { onDelete: 'cascade' }),
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
