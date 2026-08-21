// app/src/db/schema/ObjectiveTag.ts

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'


/** Objective tag lookup table (more specific than **ObjectiveColumn**) */
export const ObjectiveTag = sqliteTable('ObjectiveTag', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  order: integer('order').notNull(),
})
