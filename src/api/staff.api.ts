// app/src/api/staff.api.ts

import { Hono } from 'hono'
import { onSuccess } from '@hono-api/be'
import { queryStaffPeople } from '@src/db/queryStaff'


export default new Hono()
  .get(
    '/',
    async (c) => {
      const staff = await queryStaffPeople()
      return onSuccess(c, { data: { staff } })
    })
