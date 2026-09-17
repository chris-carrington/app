// app/src/db/schema/ObjectiveActivityType.ts

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/** Lookup table for **ObjectiveActivity** types */
export const ObjectiveActivityType = sqliteTable('ObjectiveActivityType', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull().unique(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})
