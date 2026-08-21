// app/src/db/schema/ObjectiveComment.ts

import { sql } from 'drizzle-orm'
import { Person, Objective } from '@src/db'
import { text, index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store **Objective** comments */
export const ObjectiveComment = sqliteTable(
  'ObjectiveComment',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    objectiveId: integer('objectiveId')
      .notNull()
      .references(() => Objective.id, { onDelete: 'cascade' }),
    createdBy: integer('createdBy')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
    value: text('value').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('ObjectiveComment__objectiveId__index').on(table.objectiveId),
  ]
)
