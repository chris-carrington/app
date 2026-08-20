// app/src/auth/session.api.ts

import { Hono } from 'hono'
import * as v from 'valibot'
import { pipeBoolean } from '@hono-security'
import { getSession } from '@src/auth/getSession'
import { vValidator } from '@hono/valibot-validator'


export default new Hono()
  .get(
    '/', 
    vValidator('query', v.object({
      includePersonAndContact: pipeBoolean(true),
    })),
    async (c) => {
      const res = await getSession(c, c.req.valid('query').includePersonAndContact)

      return res.status === 200
        ? c.json(res.response)
        : c.json({ error: res.message }, res.status)
    }
  )
