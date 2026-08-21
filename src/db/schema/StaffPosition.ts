// app/src/db/schema/StaffPosition.ts

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Staff position lookup table */
export const StaffPosition = sqliteTable('StaffPosition', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  isHiring: integer('isHiring', { mode: 'boolean' }).notNull().default(true),
})
