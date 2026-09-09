// app/src/api/objective.api.ts

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { mwSession } from '@src/middleware/mwSession'
import { validator, onError, onSuccess } from '@hono-api/be'
import { mwSessionPerson } from '@src/middleware/mwSessionPerson'
import { db, insertObjective, queryObjective, updateObjective, Objective } from '@src/db'
import { updateObjectiveValidator, insertObjectiveValidator } from '@src/validators/inupObjective.validator'


export default new Hono()
  .get(
    '/:id',
    async (c) => {
      const paramId = Number(c.req.param('id'))
      const objective = await queryObjective(paramId)
      return onSuccess(c, { data: {objective} })
    })
  .post(
    '/',
    validator('json', insertObjectiveValidator.schema),
    mwSessionPerson,
    async (c) => {
      const person = c.get('person')
      const data = c.req.valid('json')

      try {
        const objectiveId = await db.transaction(tx => insertObjective(tx, { ...data, createdBy: person.id }))
        return onSuccess(c, { data: {objectiveId} })
      } catch (e) {
        return onError(c, { e })
      }
    })
  .put(
    '/',
    validator('json', updateObjectiveValidator.schema),
    mwSession,
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(tx => updateObjective(tx, data))
        return onSuccess(c)
      } catch (e) {
        return onError(c, { e })
      }
    })
  .delete(
    '/:id',
    mwSession,
    async (c) => {
      const paramId = Number(c.req.param('id'))

      try {
        await db.delete(Objective).where(eq(Objective.id, paramId))
        return onSuccess(c)
      } catch (e) {
        return onError(c, { e })
      }
    })
