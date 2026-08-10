// app/src/db/schema/Trade__ServiceLead.ts

import { Trade } from './Trade'
import { relations } from 'drizzle-orm'
import { ServiceLead } from './ServiceLead'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **Trade** & **ServiceLead** */
export const Trade__ServiceLead = sqliteTable(
  'Trade__ServiceLead',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tradeId: integer('tradeId')
      .notNull()
      .references(() => Trade.id),
    serviceLeadId: integer('serviceLeadId')
      .notNull()
      .references(() => ServiceLead.id),
  },
  (table) => [
    index('Trade__ServiceLead__tradeId__index').on(table.tradeId),
    index('Trade__ServiceLead__serviceLeadId__index').on(table.serviceLeadId),
    uniqueIndex('Trade__ServiceLead__tradeId__serviceLeadId__unique').on(table.tradeId, table.serviceLeadId),
  ]
)


export const Trade__ServiceLeadRelations = relations(Trade__ServiceLead, ({ one }) => ({
  trade: one(Trade, {
    fields: [Trade__ServiceLead.tradeId],
    references: [Trade.id],
  }),
  serviceLead: one(ServiceLead, {
    fields: [Trade__ServiceLead.serviceLeadId],
    references: [ServiceLead.id],
  }),
}))
