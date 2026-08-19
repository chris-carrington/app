// app/src/joinLeadership/joinLeadership.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { db, upsertPerson, upsertContact, StaffLead, type Transaction } from '@src/db'
import { JoinLeadershipSchema, JoinLeadershipFormData } from '@src/joinLeadership/joinLeadership.validator'

export default new Hono()
  .post(
    '/',
    vValidator('json', JoinLeadershipSchema),
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(async (tx) => { // atomic
          const personId = await upserts(tx, data)
          await insertStaffLead(tx, data, personId)
        })
      } catch (e) {
        return c.json({ success: false, error: String(e) }, 500)
      }

      return c.json({ success: true })
    }
  )


async function upserts(tx: Transaction, data: JoinLeadershipFormData) {
  const contactId = await upsertContact(data, tx)
  return await upsertPerson(data, contactId, tx)
}


async function insertStaffLead(tx: Transaction, data: JoinLeadershipFormData, personId: number) {
  return tx
    .insert(StaffLead)
    .values({ personId, statusId: 1, positionId: Number(data.interest) })
}
