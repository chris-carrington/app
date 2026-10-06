// app/src/api/objectiveActivity.api.tsx

import { Hono } from 'hono'
import * as v from 'valibot'
import { pipeSelect } from '@hono-form'
import { queryObjectiveActivity } from '@src/db'
import { validator, onError } from '@hono-api/be'
import { getSession } from '@src/auth/getSession'
import { ObjectiveActivity } from '@src/lib/ObjectiveActivity'


export default new Hono()
  .get(
    '/:variant',
    validator('param', v.object({
      variant: pipeSelect({
        values: ['all', 'personal'],
        errorMissing: 'Please provide a variant',
        errorInvalid: 'Please provide a valid variant',
      })
    })),
    async (c) => {
      const variant = c.req.valid('param').variant

      let args

      switch(variant) {
        case 'all':
          args = { variant }
          break
        case 'personal':
          const resSession = await getSession(c, 'include-person')
          if (resSession?.status && resSession.status !== 200) return onError(c, resSession)

          const sessionPersonId = resSession?.status === 200 ? resSession.response.person.id : null
          if (!sessionPersonId) return onError(c, { message: '!sessionPersonId' })

          args = { variant, sessionPersonId }
          break
      }
      
      if (args.variant === 'personal' && !args.sessionPersonId) return onError(c, { message: '!sessionPersonId'})

      const res = await queryObjectiveActivity(args)

      return c.html(
        <ObjectiveActivity res={res} />
      )
    }
  )
