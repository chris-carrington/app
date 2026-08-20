// app/src/auth/session.api.ts

import { Hono } from 'hono'
import * as v from 'valibot'
import { eq } from 'drizzle-orm'
import { db, Session } from '@src/db'
import { deleteCookie } from 'hono/cookie'
import { pipeBoolean } from '@hono-security'
import { getSession } from '@src/auth/getSession'
import { vValidator } from '@hono/valibot-validator'


export default new Hono()
  .delete(
    '/:id',
    vValidator('param', v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
    })),
    async (c) => {
      await db.delete(Session) // delete session from db
        .where(eq(Session.id, Number(c.req.valid('param').id)))

      deleteCookie(c, 'session', { path: '/' }) // delete session in cookie

      return c.json({ success: true })
    }
  )
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
