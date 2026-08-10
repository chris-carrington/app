// app/src/db/schema/Person__StaffPosition.ts

import { relations } from 'drizzle-orm'
import { Person, StaffPosition, StaffEndReason } from '@src/db'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **Person** & **StaffPosition** that also tracks the employment time and potential reason for ending position */
export const Person__StaffPosition = sqliteTable(
  'Person__StaffPosition',
  {
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
  },
  (table) => [
    index('Person__StaffPosition__personId__index').on(table.personId),
    index('Person__StaffPosition__positionId__index').on(table.positionId),
    uniqueIndex('Person__StaffPosition__personId__positionId__unique').on(table.personId, table.positionId),
  ])


export const Person__StaffPositionRelations = relations(Person__StaffPosition, ({ one }) => ({
  person: one(Person, {
    fields: [Person__StaffPosition.personId],
    references: [Person.id],
  }),
  position: one(StaffPosition, {
    fields: [Person__StaffPosition.positionId],
    references: [StaffPosition.id],
  }),
  endReason: one(StaffEndReason, {
    fields: [Person__StaffPosition.endReasonId],
    references: [StaffEndReason.id],
  }),
}))
