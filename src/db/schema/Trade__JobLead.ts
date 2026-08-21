// app/src/db/schema/Trade__JobLead.ts

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
      .references(() => JobLead.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('Trade__JobLead__jobLeadId__index').on(table.jobLeadId),  // index 2nd column of the unique
    uniqueIndex('Trade__JobLead__tradeId__jobLeadId__unique').on(table.tradeId, table.jobLeadId),
  ]
)
