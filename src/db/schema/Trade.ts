// app/src/db/schema/Trade.ts

import { relations } from 'drizzle-orm'
import { Trade__ServiceLead } from './Trade__ServiceLead'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Trades lookup table */
export const Trade = sqliteTable('Trade', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
})


export const TradeRelations = relations(Trade, ({ many }) => ({
  serviceLeads: many(Trade__ServiceLead),
}))
