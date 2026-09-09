// app/src/auth/session.api.ts

import { Hono } from 'hono'
import * as v from 'valibot'
import { pipeSelect } from '@hono-form'
import { getSession } from '@src/auth/getSession'
import { validator, onError, onSuccess } from '@hono-api/be'


export default new Hono()
  .get(
    '/:variant?',
    validator('param', v.object({
      variant: pipeSelect({
        optional: true,
        values: ['just-session', 'include-person', 'include-person-and-contact'],
        errorInvalid: 'Please select a valid variant',
      })
    }),
    ),
    async (c) => {
      const res = await getSession(c, c.req.valid('param').variant)

      return res.status === 200
        ? onSuccess(c, { data: res.response })
        : onError(c, res)
    }
  )
