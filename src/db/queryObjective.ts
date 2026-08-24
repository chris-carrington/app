// app/src/db/queryObjective.ts

import { eq } from 'drizzle-orm'
import { db, Person, Objective, ObjectiveTag, Objective__Tag, Objective__Assignee } from '@src/db'
import { prop, leftJoin, createParentShape, createChildren, type InferQuery } from '@drizzle-compose'


function getBaseQuery() {
  return db
    .select({
      id: Objective.id,
      columnId: Objective.columnId,
      title: Objective.title,
      order: Objective.order,
      createdAt: Objective.createdAt,

      tagId: ObjectiveTag.id,
      tagValue: ObjectiveTag.value,
      tagBgHex: ObjectiveTag.bgHex,
      tagFgHex: ObjectiveTag.fgHex,

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
}


const parentShape = createParentShape(getBaseQuery)
  .fn(row => ({
    id: row.id,
    columnId: row.columnId,
    title: row.title,
    order: row.order,
    createdAt: row.createdAt,
  }))


const children = createChildren(getBaseQuery)
  .fn({
    prop: 'tags',
    id: (row) => row.tagId,
    shape: (row) => ({
      id: prop(row.tagId, ObjectiveTag.id),
      value: prop(row.tagValue, ObjectiveTag.value),
      bgHex: prop(row.tagBgHex, ObjectiveTag.bgHex),
      fgHex: prop(row.tagFgHex, ObjectiveTag.fgHex),
    }),
  },
  {
    prop: 'assignees',
    id: (row) => row.assigneeId,
    shape: (row) => ({
      id: prop(row.assigneeId, Person.id),
      imageId: prop(row.assigneeImageId, Person.imageId),
      firstName: prop(row.assigneeFirstName, Person.firstName),
      lastName: prop(row.assigneeLastName, Person.lastName),
    }),
  })


/** Get all objectives */
export async function queryObjectives() {
  return leftJoin(await getBaseQuery(), {
    children,
    parent: { shape: parentShape, groupId: (row) => row.columnId },
  })
}


/** Get an objective by id */
export async function queryObjective(id: number) {
  const rows = await getBaseQuery()
    .where(eq(Objective.id, id))

  const [objective] = leftJoin(rows, {
    children,
    parent: { shape: parentShape },
  })

  return objective
}


export type QueryObjective = InferQuery<typeof queryObjective>


export type QueryObjectives = InferQuery<typeof queryObjectives>
