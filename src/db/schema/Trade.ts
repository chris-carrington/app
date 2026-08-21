// app/src/db/schema/Trade.ts

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Trades lookup table */
export const Trade = sqliteTable('Trade', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})
