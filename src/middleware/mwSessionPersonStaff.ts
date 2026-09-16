// app/src/middleware/mwSessionPersonStaff.ts

import { onError } from '@hono-api/be'
import { Session, Person } from '@src/db'
import { createMiddleware } from 'hono/factory'
import { getSession } from '@src/auth/getSession'
import type { QueryStaffPersonSession } from '@src/db/queryStaff'


export const mwSessionPersonStaff = createMiddleware<{ Variables: { session: typeof Session.$inferSelect, person: typeof Person.$inferSelect, positions: QueryStaffPersonSession['positions'] } }>(async (c, next) => {
  const res = await getSession(c, 'include-staff')
  if (res.status !== 200) return onError(c, res)

  c.set('session', res.response.session)
  c.set('person', res.response.person)
  c.set('positions', res.response.positions)

  await next()
})
