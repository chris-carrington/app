// app/src/api/objective.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { mwSession } from '@src/middleware/mwSession'
import { mwSessionPerson } from '@src/middleware/mwSessionPerson'
import { db, insertObjective, queryObjective, updateObjective } from '@src/db'
import { updateObjectiveValidator, insertObjectiveValidator } from '@src/validators/inupObjective.validator'


export default new Hono()
  .get(
    '/:id',
    async (c) => {
      const paramId = Number(c.req.param('id'))
      const objective = await queryObjective(paramId)
      return c.json(objective)
    })
  .post(
    '/',
    vValidator('json', insertObjectiveValidator.schema),
    mwSessionPerson,
    async (c) => {
      const person = c.get('person')
      const data = c.req.valid('json')

      try {
        return c.json({
          success: true,
          objectiveId: await db.transaction(tx => insertObjective(tx, { ...data, createdBy: person.id }))
        })
      } catch (e) {
        console.error(e)
        return c.json({ success: false }, 500)
      }
    })
  .put(
    '/',
    vValidator('json', updateObjectiveValidator.schema),
    mwSession,
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(tx => updateObjective(tx, data))
        return c.json({ success: true })
      } catch (e) {
        console.error(e)
        return c.json({ success: false }, 500)
      }
    })
