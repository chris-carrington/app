// app/src/api/people.api.ts

import { Hono } from 'hono'
import { queryPeople } from '@src/db'
import { onSuccess } from '@hono-api/be'
import { mwSessionPersonStaff } from '@src/middleware/mwSessionPersonStaff'


export default new Hono()
  .get(
    '/',
    mwSessionPersonStaff,
    async (c) => {
      const people = await queryPeople()
      return onSuccess(c, { data: {people} })
    })
