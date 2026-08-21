// app/src/db/schema/Job__Trade.ts

import { Job, Trade } from '@src/db'
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
    index('Job__Trade__tradeId__index').on(table.tradeId), // index 2nd column of the unique
    uniqueIndex('Job__Trade__jobId__tradeId__unique').on(table.jobId, table.tradeId),
  ]
)
