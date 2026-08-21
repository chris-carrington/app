// app/src/db/schema/ObjectiveColumn.ts

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Objective column (on Kanban) lookup table */
export const ObjectiveColumn = sqliteTable('ObjectiveColumn', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})
