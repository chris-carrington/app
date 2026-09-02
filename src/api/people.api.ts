// app/src/api/people.api.ts

import { Hono } from 'hono'
import { queryPeople } from '@src/db'


export default new Hono()
  .get('/', async (c) => {
    return c.json(await queryPeople())
  })
