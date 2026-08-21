// app/src/db/schema/ObjectiveComment__Assignee.ts

import { Person, ObjectiveComment } from '@src/db'
import { index, integer, uniqueIndex, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Junction table between **ObjectiveComment** & **Person**. If someone is assigned to an **Objective** then **DO NOT** store an entry for them here. **ObjectiveComment__Assignee** is for notifying people about an **ObjectiveComment** that are **NOT** assigned to an **Objective** when we'd love for them to know about a comment. */
export const ObjectiveComment__Assignee = sqliteTable(
  'ObjectiveComment__Assignee',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    commentId: integer('commentId')
      .notNull()
      .references(() => ObjectiveComment.id, { onDelete: 'cascade' }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('ObjectiveComment__Assignee__personId__index').on(table.personId),  // index 2nd column of the unique
    uniqueIndex('ObjectiveComment__Assignee__commentId__personId__unique').on(table.commentId, table.personId),
  ]
)
