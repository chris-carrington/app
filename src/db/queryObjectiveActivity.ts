// app/src/db/queryObjectiveActivity.ts

import { eq, and, desc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'
import { prop, leftJoin, createParentShape, createChildren } from '@drizzle-compose'
import { db, Person, Objective, ObjectiveActivity, ObjectiveActivityType, ObjectiveColumn, ObjectiveComment, ObjectiveTag, Objective__Assignee } from '@src/db'


export async function queryObjectiveActivity(personId: number) {
  const rows = await getBaseQuery(personId)

  return leftJoin(rows, {
    parent: { shape: parentShape },
    children: createChildren(getBaseQuery).fn(),
  })
}


// vite blows up if alias proxy's are not w/in a function
const ActorAlias = () => alias(Person, 'Actor')
const AssigneeAlias = () => alias(Person, 'Assignee')
const FromColumnAlias = () => alias(ObjectiveColumn, 'FromColumn')
const ToColumnAlias = () => alias(ObjectiveColumn, 'ToColumn')


function getBaseQuery(personId: number) {
  const Actor = ActorAlias()
  const Assignee = AssigneeAlias()
  const FromColumn = FromColumnAlias()
  const ToColumn = ToColumnAlias()

  return db
    .select({
      id: ObjectiveActivity.id,
      typeValue: ObjectiveActivityType.value,
      createdAt: ObjectiveActivity.createdAt,

      objectiveId: Objective.id,
      objectiveTitle: Objective.title,

      actorId: Actor.id,
      actorImageId: Actor.imageId,
      actorFirstName: Actor.firstName,
      actorLastName: Actor.lastName,

      assigneeId: Assignee.id,
      assigneeImageId: Assignee.imageId,
      assigneeFirstName: Assignee.firstName,
      assigneeLastName: Assignee.lastName,

      fromColumnId: FromColumn.id,
      fromColumnValue: FromColumn.value,

      toColumnId: ToColumn.id,
      toColumnValue: ToColumn.value,

      tagId: ObjectiveTag.id,
      tagValue: ObjectiveTag.value,
      tagBgHex: ObjectiveTag.bgHex,
      tagFgHex: ObjectiveTag.fgHex,

      commentId: ObjectiveComment.id,
      commentValue: ObjectiveComment.value,
    })
    .from(ObjectiveActivity)
    .innerJoin(ObjectiveActivityType, eq(ObjectiveActivityType.id, ObjectiveActivity.typeId))
    .innerJoin(Objective, eq(Objective.id, ObjectiveActivity.objectiveId))
    // only activities on objectives this person is assigned to
    .innerJoin(
      Objective__Assignee,
      and(
        eq(Objective__Assignee.objectiveId, ObjectiveActivity.objectiveId),
        eq(Objective__Assignee.personId, personId),
      ),
    )
    .leftJoin(Actor, eq(Actor.id, ObjectiveActivity.actorId))
    .leftJoin(Assignee, eq(Assignee.id, ObjectiveActivity.assigneeId))
    .leftJoin(FromColumn, eq(FromColumn.id, ObjectiveActivity.fromColumnId))
    .leftJoin(ToColumn, eq(ToColumn.id, ObjectiveActivity.toColumnId))
    .leftJoin(ObjectiveTag, eq(ObjectiveTag.id, ObjectiveActivity.tagId))
    .leftJoin(ObjectiveComment, eq(ObjectiveComment.id, ObjectiveActivity.commentId))
    .orderBy(desc(ObjectiveActivity.createdAt))
}


const parentShape = createParentShape(getBaseQuery).fn(row => ({
  id: row.id,
  type: row.typeValue,
  createdAt: row.createdAt as unknown as string, // post api layer it'll be a string

  objective: {
    id: row.objectiveId,
    title: row.objectiveTitle,
  },

  actor: row.actorId === null ? null : {
    id: row.actorId,
    imageId: prop(row.actorImageId, Person.imageId),
    firstName: prop(row.actorFirstName, Person.firstName),
    lastName: prop(row.actorLastName, Person.lastName),
  },

  assignee: row.assigneeId === null ? null : {
    id: row.assigneeId,
    imageId: prop(row.assigneeImageId, Person.imageId),
    firstName: prop(row.assigneeFirstName, Person.firstName),
    lastName: prop(row.assigneeLastName, Person.lastName),
  },

  fromColumn: row.fromColumnId === null ? null : {
    id: row.fromColumnId,
    value: prop(row.fromColumnValue, ObjectiveColumn.value),
  },

  toColumn: row.toColumnId === null ? null : {
    id: row.toColumnId,
    value: prop(row.toColumnValue, ObjectiveColumn.value),
  },

  tag: row.tagId === null ? null : {
    id: row.tagId,
    value: prop(row.tagValue, ObjectiveTag.value),
    bgHex: prop(row.tagBgHex, ObjectiveTag.bgHex),
    fgHex: prop(row.tagFgHex, ObjectiveTag.fgHex),
  },

  comment: row.commentId === null ? null : {
    id: row.commentId,
    value: prop(row.commentValue, ObjectiveComment.value),
  },
}))
