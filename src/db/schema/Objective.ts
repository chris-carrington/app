// app/src/db/schema/Objective.ts

import { sql } from 'drizzle-orm'
import { ObjectiveColumn, Person } from '@src/db'
import { text, real, integer, index, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Stores objectives on our Kanban */
export const Objective = sqliteTable(
  'Objective',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    columnId: integer('columnId')
      .notNull()
      .references(() => ObjectiveColumn.id),
    createdBy: integer('createdBy')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    order: real('order').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('Objective__columnId__index').on(table.columnId),
    index('Objective__order__index').on(table.order),
    uniqueIndex('Objective__title__unique').on(table.title),
  ]
)
