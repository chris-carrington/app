// app/src/api/people.api.ts

import { Hono } from 'hono'
import { queryPeople } from '@src/db'
import { onSuccess } from '@hono-api/be'


export default new Hono()
  .get('/', async (c) => {
    const people = await queryPeople()
    return onSuccess(c, { data: {people} })
  })
