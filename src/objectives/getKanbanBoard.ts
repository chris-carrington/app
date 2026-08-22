// app/src/objectives/getKanbanBoard.ts

import { eq } from 'drizzle-orm'
import { db, Person, Objective, ObjectiveTag, Objective__Tag, Objective__Assignee } from '@src/db'


export async function getKanbanBoard(): Promise<KanbanBoard> {
  const result = await db
    .select({
      // Objective
      id: Objective.id,
      columnId: Objective.columnId,
      title: Objective.title,
      order: Objective.order,
      createdAt: Objective.createdAt,

      // Tag
      tagId: ObjectiveTag.id,
      tagValue: ObjectiveTag.value,

      // Assignee
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

  const columnMap = new Map<number, KanbanObjective[]>()

  const objectiveMap = new Map<number, KanbanObjectiveWithSets>()

  for (const row of result) {
    let objective = objectiveMap.get(row.id)

    if (!objective) {
      objective = {
        ...row,
        tags: [],
        assignees: [],
        tagIds: new Set(),
        assigneeIds: new Set(),
      }

      objectiveMap.set(row.id, objective);

      const columnArray = columnMap.get(row.columnId) ?? []
      columnArray.push(objective)
      columnMap.set(row.columnId, columnArray)
    }

    if (row.tagId !== null && !objective.tagIds.has(row.tagId)) {
      objective.tagIds.add(row.tagId)
      objective.tags.push({ id: row.tagId, value: row.tagValue! })
    }

    if (row.assigneeId !== null && !objective.assigneeIds.has(row.assigneeId)) {
      objective.assigneeIds.add(row.assigneeId)

      objective.assignees.push({
        id: row.assigneeId,
        imageId: row.assigneeImageId,
        firstName: row.assigneeFirstName!,
        lastName: row.assigneeLastName!,
      });
    }
  }

  return Object.fromEntries(columnMap)
}


type KanbanObjective = {
  id: number,
  columnId: number,
  title: string,
  order: number,
  createdAt: Date,
  tags: { id: number; value: string }[],
  assignees: {
    id: number;
    imageId: string | null;
    firstName: string;
    lastName: string;
  }[]
}


type KanbanObjectiveWithSets = KanbanObjective & { tagIds: Set<number>; assigneeIds: Set<number> }


type KanbanBoard = Record<number, KanbanObjective[]>
