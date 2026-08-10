// app/src/db/schema/StaffEndReason.ts

import { relations } from 'drizzle-orm'
import { StaffTemporal } from './StaffTemporal'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Staff end reason lookup table */
export const StaffEndReason = sqliteTable('StaffEndReason', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
})


export const StaffEndReasonRelations = relations(StaffEndReason, ({ many }) => ({
  staffTemporals: many(StaffTemporal),
}))
