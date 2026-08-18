// app/src/db/schema/Session.ts

import { Person } from '@src/db'
import { relations } from 'drizzle-orm'
import { text, index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Stores authentication details between a **Person** and our application */
export const Session = sqliteTable(
  'Session',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id),
    refreshTokenHash: text('refreshTokenHash').notNull(),
    expiresAt: integer('expiresAt', { mode: 'timestamp_ms' }).notNull(),
    ipAddress: text('ipAddress').notNull(),
  },
  (table) => [
    index('Session__personId__index').on(table.personId),
    index('Session__refreshTokenHash__index').on(table.refreshTokenHash),
  ])


export const SessionRelations = relations(Session, ({ one }) => ({
  person: one(Person, {
    fields: [Session.personId],
    references: [Person.id],
  }),
}))
