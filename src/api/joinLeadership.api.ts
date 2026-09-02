// app/src/api/joinLeadership.api.ts

import { Hono } from 'hono'
import { serverErrorMessage } from '@src/lib/vars'
import { vValidator } from '@hono/valibot-validator'
import { db, putPersonContact, StaffLead, type Transaction } from '@src/db'
import { joinLeadershipValidator } from '@src/validators/joinLeadership.validator'


export default new Hono()
  .post(
    '/',
    vValidator('json', joinLeadershipValidator.schema),
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(async (tx) => { // atomic
          const { personId } = await putPersonContact(tx, {
            person: { firstName: data.firstName, lastName: data.lastName },
            contact: { email: data.email }
          })

          await insertStaffLead(tx, data, personId)
        })
      } catch (e) {
        console.error(e)
        return c.json({ success: false, error: serverErrorMessage }, 500)
      }

      return c.json({ success: true })
    }
  )


async function insertStaffLead(tx: Transaction, data: typeof joinLeadershipValidator.data, personId: number) {
  return tx
    .insert(StaffLead)
    .values({ personId, statusId: 1, positionId: Number(data.interest) })
}
