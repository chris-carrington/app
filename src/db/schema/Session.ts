// app/src/db/schema/Session.ts

import { Person } from '@src/db'
import { sql, relations } from 'drizzle-orm'
import { text, index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Stores authentication details between a **Person** and our application */
export const Session = sqliteTable(
  'Session',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
    expiresAt: integer('expiresAt', { mode: 'timestamp_ms' }).notNull(),
    ipAddress: text('ipAddress').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`)
  },
  (table) => [
    index('Session__personId__index').on(table.personId),
  ])


export const SessionRelations = relations(Session, ({ one }) => ({
  person: one(Person, {
    fields: [Session.personId],
    references: [Person.id],
  }),
}))
