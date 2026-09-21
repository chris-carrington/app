// app/src/api/objectiveActivity.api.tsx

import { Hono } from 'hono'
import { queryObjectiveActivity } from '@src/db'
import { ObjectiveActivity } from '@src/lib/ObjectiveActivity'


export default new Hono()
  .get(
    '/',
    async (c) => {
      const res = await queryObjectiveActivity({ variant: 'all' })

      return c.html(
        <ObjectiveActivity res={res} />
      )
    }
  )
