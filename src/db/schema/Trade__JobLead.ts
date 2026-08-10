// app/src/db/schema/Trade__JobLead.ts

import { relations } from 'drizzle-orm'
import { Trade, JobLead } from '@src/db'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **Trade** & **JobLead** */
export const Trade__JobLead = sqliteTable(
  'Trade__JobLead',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tradeId: integer('tradeId')
      .notNull()
      .references(() => Trade.id),
    jobLeadId: integer('jobLeadId')
      .notNull()
      .references(() => JobLead.id),
  },
  (table) => [
    index('Trade__JobLead__tradeId__index').on(table.tradeId),
    index('Trade__JobLead__jobLeadId__index').on(table.jobLeadId),
    uniqueIndex('Trade__JobLead__tradeId__jobLeadId__unique').on(table.tradeId, table.jobLeadId),
  ]
)


export const Trade__JobLeadRelations = relations(Trade__JobLead, ({ one }) => ({
  trade: one(Trade, {
    fields: [Trade__JobLead.tradeId],
    references: [Trade.id],
  }),
  jobLead: one(JobLead, {
    fields: [Trade__JobLead.jobLeadId],
    references: [JobLead.id],
  }),
}))
