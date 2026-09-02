// app/src/auth/session.api.ts

import { Hono } from 'hono'
import * as v from 'valibot'
import { pipeSelect } from '@hono-security'
import { getSession } from '@src/auth/getSession'
import { vValidator } from '@hono/valibot-validator'


export default new Hono()
  .get(
    '/:variant?',
    vValidator('param', v.object({
        variant: pipeSelect({
          optional: true,
          values: ['just-session', 'include-person', 'include-person-and-contact'],
          errorMissing: 'Please select a variant',
          errorInvalid: 'Please select a valid variant',
        })
      }),
    ),
    async (c) => {
      const res = await getSession(c, c.req.valid('param').variant)

      return res.status === 200
        ? c.json(res.response)
        : c.json({ error: res.message }, res.status)
    }
  )
