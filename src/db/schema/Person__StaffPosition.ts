// app/src/db/schema/Person__StaffPosition.ts

import { Person, StaffPosition, StaffEndReason } from '@src/db'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **Person** & **StaffPosition** that also tracks the employment time and potential reason for ending position */
export const Person__StaffPosition = sqliteTable(
  'Person__StaffPosition',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
    positionId: integer('positionId')
      .notNull()
      .references(() => StaffPosition.id),
    endReasonId: integer('endReasonId')
      .references(() => StaffEndReason.id),
    startDate: integer('startDate', { mode: 'timestamp_ms' }).notNull(),
    endDate: integer('endDate', { mode: 'timestamp_ms' }),
  },
  (table) => [
    index('Person__StaffPosition__positionId__index').on(table.positionId),  // index 2nd column of the unique
    uniqueIndex('Person__StaffPosition__personId__positionId__unique').on(table.personId, table.positionId),
  ])
