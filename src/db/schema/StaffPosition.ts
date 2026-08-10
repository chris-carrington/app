// app/src/db/schema/StaffPosition.ts

import { relations } from 'drizzle-orm'
import { StaffLead } from './StaffLead'
import { StaffTemporal } from './StaffTemporal'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Staff position lookup table */
export const StaffPosition = sqliteTable('StaffPosition', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
  isHiring: integer('isHiring', { mode: 'boolean' }).default(true),
})


export const StaffPositionRelations = relations(StaffPosition, ({ many }) => ({
  staffLeads: many(StaffLead),
  staffTemporals: many(StaffTemporal),
}))
