// app/src/db/schema/Objective__Assignee.ts

import { Objective, Person } from '@src/db'
import { index, integer, sqliteTable, uniqueIndex } from 'drizzle-orm/sqlite-core'


/** Junction table between **Objective** & **Person** */
export const Objective__Assignee = sqliteTable(
  'Objective__Assignee',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    objectiveId: integer('objectiveId')
      .notNull()
      .references(() => Objective.id, { onDelete: 'cascade' }),
    personId: integer('personId')
      .notNull()
      .references(() => Person.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('Objective__Assignee__personId__index').on(table.personId), // index 2nd column of the unique
    uniqueIndex('Objective__Assignee__objectiveId__personId__unique').on(table.objectiveId, table.personId),
  ]
)
