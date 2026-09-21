// app/src/db/inupObjective.ts

import { eq, and, inArray } from 'drizzle-orm'
import { dsObjectiveActivityTypes } from '@src/dataStructures/objectiveActivityTypes.ds'
import { Objective, ObjectiveActivity, Objective__Tag, Objective__Assignee, type Transaction } from '@src/db'
import type { insertObjectiveValidator, updateObjectiveValidator } from '@src/validators/inupObjective.validator'


/** Insert a new Objective */
export async function insertObjective(actorId: number, tx: Transaction, input: InupObjectiveInput<'insert'>): Promise<number> {
  const { columnId, createdBy, title, description, order } = input

  const objective = await tx // insert objective
    .insert(Objective)
    .values({ columnId, createdBy, title, description, order })
    .returning({ id: Objective.id })
    .get()

  await insertObjectiveDependants(actorId, columnId, tx, input, objective.id) // insert children

  return objective.id
}


async function insertObjectiveDependants(actorId: number, columnId: number, tx: Transaction, input: InupObjectiveInput<'insert'>, objectiveId: number) {
  const promises: Promise<any>[] = [
    tx.insert(ObjectiveActivity).values({
      objectiveId,
      typeId: dsObjectiveActivityTypes.objectiveCreated,
      actorId,
      toColumnId: columnId
    })
  ]

  const { assigneeIds, tagIds } = input

  if (assigneeIds.length > 0) {
    promises.push(
      tx.insert(Objective__Assignee).values(
        assigneeIds.map((personId) => ({
          objectiveId,
          personId
        })),
      ),
    )

    promises.push(
      tx.insert(ObjectiveActivity).values(
        assigneeIds.map((assigneeId) => ({
          objectiveId,
          typeId: dsObjectiveActivityTypes.assigneeAdded,
          actorId,
          assigneeId,
        })),
      ),
    )
  }

  if (tagIds.length > 0) {
    promises.push(
      tx.insert(Objective__Tag).values(
        tagIds.map((tagId) => ({
          objectiveId,
          tagId
        })),
      ),
    )

    promises.push(
      tx.insert(ObjectiveActivity).values(
        tagIds.map((tagId) => ({
          objectiveId,
          typeId: dsObjectiveActivityTypes.tagAdded,
          actorId,
          tagId
        })),
      ),
    )
  }

  await Promise.all(promises)
}


/** Update an existing Objective */
export async function updateObjective(actorId: number, tx: Transaction, input: InupObjectiveInput<'update'>): Promise<number> {
  const { id, columnId, title, description, order, assigneeIds, tagIds } = input

  const existing = await tx
    .select({ columnId: Objective.columnId })
    .from(Objective)
    .where(eq(Objective.id, id))
    .get()

  await tx // update objective
    .update(Objective)
    .set({ columnId, title, description, order })
    .where(eq(Objective.id, id))

  if (existing && existing.columnId !== columnId) {
    await tx.insert(ObjectiveActivity).values({
      objectiveId: id,
      typeId: dsObjectiveActivityTypes.columnChanged,
      actorId,
      fromColumnId: existing.columnId,
      toColumnId: columnId,
    })
  }

  await Promise.all([ // update children
    assigneeIds ? updateAssignees(actorId, tx, id, assigneeIds) : null,
    tagIds ? updateTags(actorId, tx, id, tagIds) : null,
  ])

  return id
}


async function updateAssignees(actorId: number, tx: Transaction, objectiveId: number, newPersonIds: number[]): Promise<void> {
  const newSet = new Set(newPersonIds)

  const existing = await tx
    .select({ personId: Objective__Assignee.personId })
    .from(Objective__Assignee)
    .where(eq(Objective__Assignee.objectiveId, objectiveId))

  const existingSet = new Set(existing.map((r) => r.personId))

  const toRemove = [...existingSet].filter((id) => !newSet.has(id))

  if (toRemove.length > 0) {
    await Promise.all([
      tx.delete(Objective__Assignee)
        .where(
          and(
            eq(Objective__Assignee.objectiveId, objectiveId),
            inArray(Objective__Assignee.personId, toRemove),
          ),
        ),
      tx.insert(ObjectiveActivity).values(
        toRemove.map((assigneeId) => ({
          objectiveId,
          typeId: dsObjectiveActivityTypes.assigneeRemoved,
          actorId,
          assigneeId,
        })),
      )
    ])
  }

  const toAdd = newPersonIds.filter((id) => !existingSet.has(id))

  if (toAdd.length > 0) {
    await Promise.all([
      tx.insert(Objective__Assignee).values(
        toAdd.map((personId) => ({
          objectiveId,
          personId,
        })),
      ),
      tx.insert(ObjectiveActivity).values(
        toAdd.map((assigneeId) => ({
          objectiveId,
          typeId: dsObjectiveActivityTypes.assigneeAdded,
          actorId,
          assigneeId,
        })),
      )
    ])
  }
}


async function updateTags(actorId: number, tx: Transaction, objectiveId: number, newTagIds: number[]): Promise<void> {
  const newSet = new Set(newTagIds)

  const existing = await tx
    .select({ tagId: Objective__Tag.tagId })
    .from(Objective__Tag)
    .where(eq(Objective__Tag.objectiveId, objectiveId))

  const existingSet = new Set(existing.map((r) => r.tagId))

  const toRemove = [...existingSet].filter((id) => !newSet.has(id))

  if (toRemove.length > 0) {
    await Promise.all([
      tx.delete(Objective__Tag)
        .where(
          and(
            eq(Objective__Tag.objectiveId, objectiveId),
            inArray(Objective__Tag.tagId, toRemove),
          ),
        ),
      tx.insert(ObjectiveActivity).values(
        toRemove.map((tagId) => ({
          objectiveId,
          typeId: dsObjectiveActivityTypes.tagRemoved,
          actorId,
          tagId,
        })),
      )
    ])

  }

  const toAdd = newTagIds.filter((id) => !existingSet.has(id))

  if (toAdd.length > 0) {
    await Promise.all([
      tx.insert(Objective__Tag).values(
        toAdd.map((tagId) => ({
          objectiveId,
          tagId,
        })),
      ),
      tx.insert(ObjectiveActivity).values(
        toAdd.map((tagId) => ({
          objectiveId,
          typeId: dsObjectiveActivityTypes.tagAdded,
          actorId,
          tagId,
        })),
      )
    ])
  }
}


export type InupObjectiveInput<Mode extends 'insert' | 'update'> = Mode extends 'insert'
  ? typeof insertObjectiveValidator.data & { createdBy: number }
  : Mode extends 'update'
  ? typeof updateObjectiveValidator.data
  : never
