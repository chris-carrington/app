// app/src/db/schema/MagicToken.ts

import { Person } from '@src/db'
import { relations } from 'drizzle-orm'
import { text, index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Before a **Session** is created we send a **Person** an email w/ a **MagicToken** (*passwordless / magic link authenticatio*) */
export const MagicToken = sqliteTable(
  'MagicToken',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
    tokenHash: text('tokenHash').notNull(),
    expiresAt: integer('expiresAt', { mode: 'timestamp_ms' }).notNull(),
    used: integer('used', { mode: 'boolean' }).default(false),
  },
  (table) => [
    index('MagicToken__personId__index').on(table.personId),
    index('MagicToken__tokenHash__index').on(table.tokenHash),
  ])


export const MagicTokenRelations = relations(MagicToken, ({ one }) => ({
  person: one(Person, {
    fields: [MagicToken.personId],
    references: [Person.id],
  }),
}))
