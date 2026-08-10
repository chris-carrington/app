// app/src/db/schema/Job__Client.ts

import { Job, Person } from '@src/db'
import { relations } from 'drizzle-orm'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **Job** & **Person** (Client) */
export const Job__Client = sqliteTable(
  'Job__Client',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    jobId: integer('jobId')
      .notNull()
      .references(() => Job.id),
    clientId: integer('clientId')
      .notNull()
      .references(() => Person.id),
  },
  (table) => [
    index('Job__Client__jobId__index').on(table.jobId),
    index('Job__Client__clientId__index').on(table.clientId),
    uniqueIndex('Job__Client__jobId__clientId__unique').on(table.jobId, table.clientId),
  ]
)


export const Job__ClientRelations = relations(Job__Client, ({ one }) => ({
  client: one(Person, {
    fields: [Job__Client.clientId],
    references: [Person.id],
  }),
  job: one(Job, {
    fields: [Job__Client.jobId],
    references: [Job.id],
  }),
}))
