// app/src/serviceRequest/serviceRequest.api.ts

import { Hono } from 'hono'
import { vValidator } from '@hono/valibot-validator'
import { db, upsertPerson, upsertContact, JobLead, Trade__JobLead, type Transaction } from '@src/db'
import { ServiceRequestFormData, ServiceRequestSchema } from '@src/serviceRequest/serviceRequest.validator'


const app = new Hono()

app.post(
  '/',
  vValidator('json', ServiceRequestSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      await db.transaction(async (tx) => { // atomic
        const personId = await upserts(tx, data)
        const jobLeadId = await insertJobLead(tx, data, personId)

        await Promise.all([
          data.trade.map(tradeId => insertTrade__JobLead({ tx, jobLeadId, tradeId: Number(tradeId) }))
        ])
      })
    } catch (e) {
      return c.json({ success: false, error: String(e) }, 500)
    }

    return c.json({ success: true })
  }
)


async function upserts(tx: Transaction, data: ServiceRequestFormData) {
  const contactId = await upsertContact(data, tx)
  return await upsertPerson(data, contactId, tx)
}


async function insertJobLead(tx: Transaction, data: ServiceRequestFormData, personId: number) {
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


export default app
