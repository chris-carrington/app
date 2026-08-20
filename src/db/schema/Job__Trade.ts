// app/src/db/schema/Job__Trade.ts

import { Job, Trade } from '@src/db'
import { relations } from 'drizzle-orm'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **Job** & **Trade** */
export const Job__Trade = sqliteTable(
  'Job__Trade',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    jobId: integer('jobId')
      .notNull()
      .references(() => Job.id, { onDelete: 'cascade' }),
    tradeId: integer('tradeId')
      .notNull()
      .references(() => Trade.id),
  },
  (table) => [
    index('Job__Trade__tradeId__index').on(table.tradeId),
    index('Job__Trade__jobId__index').on(table.jobId),
    uniqueIndex('Job__Trade__jobId__tradeId__unique').on(table.jobId, table.tradeId),
  ]
)


export const Job__TradeRelations = relations(Job__Trade, ({ one }) => ({
  job: one(Job, {
    fields: [Job__Trade.jobId],
    references: [Job.id],
  }),
  trade: one(Trade, {
    fields: [Job__Trade.tradeId],
    references: [Trade.id],
  }),
}))
