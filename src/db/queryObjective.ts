// app/src/db/queryObjective.ts

import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'
import { db, Person, Objective, ObjectiveTag, ObjectiveComment, Objective__Tag, Objective__Assignee } from '@src/db'
import { prop, leftJoin, createParentShape, createChildren, type InferQuery } from '@drizzle-compose'


const CommenterAlias = () => alias(Person, 'Commenter') // vite blows up if this proxy is not w/in a function


function getBaseQuery() {
  const Commenter = CommenterAlias()

  return db
    .select({
      id: Objective.id,
      columnId: Objective.columnId,
      title: Objective.title,
      description: Objective.description,
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

      commentId: ObjectiveComment.id,
      commentValue: ObjectiveComment.value,
      commentCreatedAt: ObjectiveComment.createdAt,

      commenterId: Commenter.id,
      commenterImageId: Commenter.imageId,
      commenterFirstName: Commenter.firstName,
      commenterLastName: Commenter.lastName,
    })
    .from(Objective)
    .leftJoin(Objective__Tag, eq(Objective__Tag.objectiveId, Objective.id))
    .leftJoin(ObjectiveTag, eq(ObjectiveTag.id, Objective__Tag.tagId))
    .leftJoin(Objective__Assignee, eq(Objective__Assignee.objectiveId, Objective.id))
    .leftJoin(Person, eq(Person.id, Objective__Assignee.personId))
    .leftJoin(ObjectiveComment, eq(ObjectiveComment.objectiveId, Objective.id))
    .leftJoin(Commenter, eq(Commenter.id, ObjectiveComment.createdBy))
    .orderBy(
      Objective.columnId,
      Objective.order,
      ObjectiveTag.order,
      Person.firstName,
      ObjectiveComment.createdAt,
    )
}


const parentShape = createParentShape(getBaseQuery)
  .fn(row => ({
    id: row.id,
    columnId: row.columnId,
    title: row.title,
    description: row.description,
    order: row.order,
    createdAt: row.createdAt as unknown as string, // post api layer it'll be a string
  }))


function getChildren() {
  const Commenter = CommenterAlias()

  return createChildren(getBaseQuery)
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
      },
      {
        prop: 'comments',
        id: (row) => row.commentId,
        shape: (row) => ({
          id: prop(row.commentId, ObjectiveComment.id),
          value: prop(row.commentValue, ObjectiveComment.value),
          createdAt: row.commentCreatedAt as unknown as string, // post api layer it'll be a string
          createdBy: {
            id: prop(row.commenterId, Commenter.id),
            imageId: prop(row.commenterImageId, Commenter.imageId),
            firstName: prop(row.commenterFirstName, Commenter.firstName),
            lastName: prop(row.commenterLastName, Commenter.lastName),
          },
        }),
      }
    )
}



/** Get all objectives */
export async function queryObjectives() {
  return leftJoin(await getBaseQuery(), {
    children: getChildren(),
    parent: { shape: parentShape, groupId: (row) => row.columnId },
  })
}


/** Get an objective by id */
export async function queryObjective(id: number) {
  const rows = await getBaseQuery()
    .where(eq(Objective.id, id))

  const [objective] = leftJoin(rows, {
    children: getChildren(),
    parent: { shape: parentShape },
  })

  return objective
}


export type QueryObjective = InferQuery<typeof queryObjective>


export type QueryObjectives = InferQuery<typeof queryObjectives>
