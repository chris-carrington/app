// app/src/db/schema/JobStatus.ts

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Job status lookup table */
export const JobStatus = sqliteTable('JobStatus', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  description: text('description').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})
