// app/src/db/schema/Job.ts

import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { JobStatus, JobLead, Job__Trade, Job__Client } from '@src/db'
import { text, index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store all work projects */
export const Job = sqliteTable(
  'Job',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    statusId: integer('statusId')
      .notNull()
      .references(() => JobStatus.id),
    description: text('description'),
    address: text('address').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('Job__statusId__index').on(table.statusId),
  ])


export const JobRelations = relations(Job, ({ one, many }) => ({
  status: one(JobStatus, {
    fields: [Job.statusId],
    references: [JobStatus.id],
  }),
  lead: one(JobLead),
  clients: many(Job__Client),
  trades: many(Job__Trade),
}))
