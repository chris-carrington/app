// app/src/db/schema/JobStatus.ts

import { Job } from './Job'
import { relations } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Job status lookup table */
export const JobStatus = sqliteTable('JobStatus', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
})


export const JobStatusRelations = relations(JobStatus, ({ many }) => ({
  jobs: many(Job),
}))
