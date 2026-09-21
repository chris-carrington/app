// app/src/db/schema/ObjectiveActivity.ts

import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { Objective, ObjectiveActivityType, ObjectiveColumn, ObjectiveTag, Person, ObjectiveComment } from '@src/db'


/** Stores activity/events for an **Objective** */
export const ObjectiveActivity = sqliteTable(
  'ObjectiveActivity',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    objectiveId: integer('objectiveId')
      .notNull()
      .references(() => Objective.id, { onDelete: 'cascade' }),

    typeId: integer('typeId')
      .notNull()
      .references(() => ObjectiveActivityType.id),

    /** Person who performed the action, when known */
    actorId: integer('actorId').references(() => Person.id, { onDelete: 'set null' }),

    /** Used for assignee_added / assignee_removed */
    assigneeId: integer('assigneeId').references(() => Person.id, { onDelete: 'set null' }),

    /** Used for column_changed */
    fromColumnId: integer('fromColumnId').references(() => ObjectiveColumn.id, { onDelete: 'set null' }),
    toColumnId: integer('toColumnId').references(() => ObjectiveColumn.id, { onDelete: 'set null' }),

    /** Used for tag_added / tag_removed */
    tagId: integer('tagId').references(() => ObjectiveTag.id, { onDelete: 'set null' }),

    /** Used for comment_added */
    commentId: integer('commentId').references(() => ObjectiveComment.id, { onDelete: 'cascade' }),

    createdAt: integer('createdAt', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('ObjectiveActivity__objectiveId__createdAt__index').on(table.objectiveId, table.createdAt),
    index('ObjectiveActivity__typeId__index').on(table.typeId),
    index('ObjectiveActivity__actorId__index').on(table.actorId),
    index('ObjectiveActivity__assigneeId__index').on(table.assigneeId),
    index('ObjectiveActivity__tagId__index').on(table.tagId),
    index('ObjectiveActivity__commentId__index').on(table.commentId),
    index('ObjectiveActivity__createdAt__index').on(table.createdAt),
  ]
)
