// app/src/db/schema/Trade.ts

import { relations } from 'drizzle-orm'
import { Job__Trade, Trade__JobLead } from '@src/db'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Trades lookup table */
export const Trade = sqliteTable('Trade', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
})


export const TradeRelations = relations(Trade, ({ many }) => ({
  jobLeads: many(Trade__JobLead),
  jobs: many(Job__Trade),
}))
