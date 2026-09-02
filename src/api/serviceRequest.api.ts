// app/src/api/serviceRequest.api.ts

import { Hono } from 'hono'
import { serverErrorMessage } from '@src/lib/vars'
import { vValidator } from '@hono/valibot-validator'
import { serviceRequestValidator } from '@src/validators/serviceRequest.validator'
import { db, putPersonContact, JobLead, Trade__JobLead, type Transaction } from '@src/db'


export default new Hono()
  .post(
    '/',
    vValidator('json', serviceRequestValidator.schema),
    async (c) => {
      const data = c.req.valid('json')

      try {
        await db.transaction(async (tx) => { // atomic
          const { personId } = await putPersonContact(tx, {
            person: { firstName: data.firstName, lastName: data.lastName },
            contact: { email: data.email }
          })

          const jobLeadId = await insertJobLead(tx, data, personId)

          await Promise.all(
            data.trade.map(tradeId => insertTrade__JobLead({ tx, jobLeadId, tradeId: Number(tradeId) }))
          )
        })
      } catch (e) {
        console.error(e)
        return c.json({ success: false, error: serverErrorMessage }, 500)
      }

      return c.json({ success: true })
    }
  )


async function insertJobLead(tx: Transaction, data: typeof serviceRequestValidator.data, personId: number) {
  const [inserted] = await tx
    .insert(JobLead)
    .values({ personId, statusId: 1, description: data.description })
    .returning({ id: JobLead.id })

  return inserted.id
}


async function insertTrade__JobLead(props: { tx: Transaction, tradeId: number, jobLeadId: number }) {
  return props.tx
    .insert(Trade__JobLead)
    .values({ tradeId: props.tradeId, jobLeadId: props.jobLeadId })
    .returning({ id: Trade__JobLead.id })
}
