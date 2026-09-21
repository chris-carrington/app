// app/src/db/schema/ObjectiveActivityType.ts

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/** Objective activity types lookup table */
export const ObjectiveActivityType = sqliteTable('ObjectiveActivityType', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull().unique(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})
