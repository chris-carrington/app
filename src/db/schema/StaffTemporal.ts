// app/src/db/schema/StaffTemporal.ts

import { Person } from './Person'
import { relations } from 'drizzle-orm'
import { StaffPosition } from './StaffPosition'
import { StaffEndReason } from './StaffEndReason'
import { sqliteTable, integer } from 'drizzle-orm/sqlite-core'


/** Store people's employment periods */
export const StaffTemporal = sqliteTable('StaffTemporal', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  personId: integer('personId')
    .notNull()
    .references(() => Person.id),
  positionId: integer('positionId')
    .notNull()
    .references(() => StaffPosition.id),
  endReasonId: integer('endReasonId')
    .references(() => StaffEndReason.id),
  startDate: integer('startDate', { mode: 'timestamp_ms' }).notNull(),
  endDate: integer('endDate', { mode: 'timestamp_ms' }),
})


export const StaffTemporalRelations = relations(StaffTemporal, ({ one }) => ({
  person: one(Person, {
    fields: [StaffTemporal.personId],
    references: [Person.id],
  }),
  position: one(StaffPosition, {
    fields: [StaffTemporal.positionId],
    references: [StaffPosition.id],
  }),
  endReason: one(StaffEndReason, {
    fields: [StaffTemporal.endReasonId],
    references: [StaffEndReason.id],
  }),
}))