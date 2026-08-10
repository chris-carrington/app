// app/src/db/schema/Job.ts

import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { JobStatus } from './JobStatus'
import { ServiceLead } from './ServiceLead'
import { Job__Client } from './Job__Client'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store all work projects */
export const Job = sqliteTable('Job', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  statusId: integer('statusId')
    .notNull()
    .references(() => JobStatus.id),
  description: text('description'),
  address: text('address').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})


export const JobRelations = relations(Job, ({ one, many }) => ({
  status: one(JobStatus, {
    fields: [Job.statusId],
    references: [JobStatus.id],
  }),
  serviceLeads: many(ServiceLead),
  clients: many(Job__Client)
}))
