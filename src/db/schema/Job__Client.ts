// app/src/db/schema/Job__Client.ts

import { Job, Person } from '@src/db'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **Job** & **Person** (Client) */
export const Job__Client = sqliteTable(
  'Job__Client',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    jobId: integer('jobId')
      .notNull()
      .references(() => Job.id, { onDelete: 'cascade' }),
    clientId: integer('clientId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('Job__Client__clientId__index').on(table.clientId), // index 2nd column of the unique
    uniqueIndex('Job__Client__jobId__clientId__unique').on(table.jobId, table.clientId),
  ]
)
