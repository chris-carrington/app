// app/src/objectives/objective.api.ts

import { Hono } from 'hono'
import { queryObjective } from '@src/db'


export default new Hono()
  .get('/:id', async (c) => {
    const paramId = Number(c.req.param('id'))
    const objective = await queryObjective(paramId)
    return c.json(objective)
  })
