// app/src/objectives/getKanbanBoard.ts

import { eq } from 'drizzle-orm'
import { prop, drizzleLeftJoin } from '@drizzle-left-join'
import { db, Person, Objective, ObjectiveTag, Objective__Tag, Objective__Assignee } from '@src/db'


export async function getKanbanBoard() {
  const result = await db
    .select({
      id: Objective.id,
      columnId: Objective.columnId,
      title: Objective.title,
      order: Objective.order,
      createdAt: Objective.createdAt,

      tagId: ObjectiveTag.id,
      tagValue: ObjectiveTag.value,

      assigneeId: Person.id,
      assigneeImageId: Person.imageId,
      assigneeFirstName: Person.firstName,
      assigneeLastName: Person.lastName,
    })
    .from(Objective)
    .leftJoin(Objective__Tag, eq(Objective__Tag.objectiveId, Objective.id))
    .leftJoin(ObjectiveTag, eq(ObjectiveTag.id, Objective__Tag.tagId))
    .leftJoin(Objective__Assignee, eq(Objective__Assignee.objectiveId, Objective.id))
    .leftJoin(Person, eq(Person.id, Objective__Assignee.personId))
    .orderBy(Objective.columnId, Objective.order, ObjectiveTag.order, Person.firstName)

  return drizzleLeftJoin(result, {
    parent: {
      id: row => row.id,
      groupId: row => row.columnId,
      shape: row => ({
        id: row.id,
        columnId: row.columnId,
        title: row.title,
        order: row.order,
        createdAt: row.createdAt,
      }),
    },
    children: [
      {
        prop: 'tags',
        id: row => row.tagId,
        shape: row => ({
          id: prop(row.tagId, ObjectiveTag.id),
          value: prop(row.tagValue, ObjectiveTag.value),
        }),
      },
      {
        prop: 'assignees',
        id: row => row.assigneeId,
        shape: row => ({
          id: prop(row.assigneeId, Person.id),
          imageId: prop(row.assigneeImageId, Person.imageId),
          firstName: prop(row.assigneeFirstName, Person.firstName),
          lastName: prop(row.assigneeLastName, Person.lastName),
        }),
      },
    ],
  })
}
