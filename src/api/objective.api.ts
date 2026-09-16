// app/src/api/objective.api.ts

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { validator, onError, onSuccess } from '@hono-api/be'
import { mwSessionPersonStaff } from '@src/middleware/mwSessionPersonStaff'
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
    mwSessionPersonStaff,
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
    mwSessionPersonStaff,
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
    mwSessionPersonStaff,
    async (c) => {
      const paramId = Number(c.req.param('id'))

      try {
        await db.delete(Objective).where(eq(Objective.id, paramId))
        return onSuccess(c)
      } catch (e) {
        return onError(c, { e })
      }
    })
