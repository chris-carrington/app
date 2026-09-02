// app/src/db/inupObjective.ts

import { eq, and, inArray } from 'drizzle-orm'
import { Objective, Objective__Tag, Objective__Assignee, type Transaction } from '@src/db'
import type { insertObjectiveValidator, updateObjectiveValidator } from '@src/validators/inupObjective.validator'


/** Insert a new Objective */
export async function insertObjective(tx: Transaction, input: InupObjectiveInput<'insert'>): Promise<number> {
  const { columnId, createdBy, title, description, order } = input

  const [objective] = await tx // insert objective
    .insert(Objective)
    .values({ columnId, createdBy, title, description, order })
    .returning({ id: Objective.id })

  await insertObjectiveChildren(tx, input, objective.id) // insert children

  return objective.id
}


async function insertObjectiveChildren(tx: Transaction, input: InupObjectiveInput<'insert'>, objectiveId: number) {
  const promises: Promise<unknown>[] = [] // alter db in parallel

  const { assigneeIds, tagIds } = input

  if (assigneeIds.length > 0) {
    promises.push(
      tx.insert(Objective__Assignee).values(
        assigneeIds.map((personId) => ({
          objectiveId,
          personId,
        })),
      ),
    )
  }

  if (tagIds.length > 0) {
    promises.push(
      tx.insert(Objective__Tag).values(
        tagIds.map((tagId) => ({
          objectiveId,
          tagId,
        })),
      ),
    )
  }

  if (promises.length) {
    await Promise.all(promises)
  }
}


/** Update an existing Objective */
export async function updateObjective(tx: Transaction, input: InupObjectiveInput<'update'>): Promise<number> {
  const { id, columnId, title, description, order, assigneeIds, tagIds } = input

  await tx // update objective
    .update(Objective)
    .set({ columnId, title, description, order })
    .where(eq(Objective.id, id))

  await Promise.all([ // update children
    assigneeIds ? updateAssignees(tx, id, assigneeIds) : null,
    tagIds ? updateTags(tx, id, tagIds) : null,
  ])

  return id
}


async function updateAssignees(tx: Transaction, objectiveId: number, newPersonIds: number[]): Promise<void> {
  const newSet = new Set(newPersonIds)

  const existing = await tx
    .select({ personId: Objective__Assignee.personId })
    .from(Objective__Assignee)
    .where(eq(Objective__Assignee.objectiveId, objectiveId))

  const existingSet = new Set(existing.map((r) => r.personId))

  const toRemove = [...existingSet].filter((id) => !newSet.has(id))

  if (toRemove.length > 0) {
    await tx
      .delete(Objective__Assignee)
      .where(
        and(
          eq(Objective__Assignee.objectiveId, objectiveId),
          inArray(Objective__Assignee.personId, toRemove),
        ),
      )
  }

  const toAdd = newPersonIds.filter((id) => !existingSet.has(id))

  if (toAdd.length > 0) {
    await tx.insert(Objective__Assignee).values(
      toAdd.map((personId) => ({
        objectiveId,
        personId,
      })),
    )
  }
}


async function updateTags(tx: Transaction, objectiveId: number, newTagIds: number[],): Promise<void> {
  const newSet = new Set(newTagIds)

  const existing = await tx
    .select({ tagId: Objective__Tag.tagId })
    .from(Objective__Tag)
    .where(eq(Objective__Tag.objectiveId, objectiveId))

  const existingSet = new Set(existing.map((r) => r.tagId))

  const toRemove = [...existingSet].filter((id) => !newSet.has(id))

  if (toRemove.length > 0) {
    await tx
      .delete(Objective__Tag)
      .where(
        and(
          eq(Objective__Tag.objectiveId, objectiveId),
          inArray(Objective__Tag.tagId, toRemove),
        ),
      )
  }

  const toAdd = newTagIds.filter((id) => !existingSet.has(id))

  if (toAdd.length > 0) {
    await tx.insert(Objective__Tag).values(
      toAdd.map((tagId) => ({
        objectiveId,
        tagId,
      })),
    )
  }
}


export type InupObjectiveInput<Mode extends 'insert' | 'update'> =
  Mode extends 'insert'
  ? typeof insertObjectiveValidator.data & { createdBy: number }
  : Mode extends 'update'
  ? typeof updateObjectiveValidator.data
  : never
