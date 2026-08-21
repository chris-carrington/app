// app/src/db/schema/StaffEndReason.ts

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Staff end reason lookup table */
export const StaffEndReason = sqliteTable('StaffEndReason', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})
