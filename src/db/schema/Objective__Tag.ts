// app/src/db/schema/Objective__Tag.ts

import { Objective, ObjectiveTag } from '@src/db'
import { index, integer, sqliteTable, uniqueIndex } from 'drizzle-orm/sqlite-core'


/** Junction table between **Objective** & **ObjectiveTag** */
export const Objective__Tag = sqliteTable(
  'Objective__Tag',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    objectiveId: integer('objectiveId')
      .notNull()
      .references(() => Objective.id, { onDelete: 'cascade' }),
    tagId: integer('tagId')
      .notNull()
      .references(() => ObjectiveTag.id),
  },
  (table) => [
    index('Objective__Tag__tagId__index').on(table.tagId),  // index 2nd column of the unique
    uniqueIndex('Objective__Tag__objectiveId__tagId__unique').on(table.objectiveId, table.tagId),
  ]
)
