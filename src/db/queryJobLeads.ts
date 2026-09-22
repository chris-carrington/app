// app/src/db/queryJobLeads.ts

import { eq } from 'drizzle-orm'
import { db, Person, Contact, JobLead, LeadStatus, Job, JobStatus, Trade, Trade__JobLead } from '@src/db'
import { prop, nested, epoch, leftJoin, createParentShape, createChildren, type InferQuery } from '@drizzle-compose'


function getBaseQuery() {
  return db
    .select({
      id: JobLead.id,
      description: JobLead.description,
      createdAt: JobLead.createdAt,

      personId: Person.id,
      personImageId: Person.imageId,
      personFirstName: Person.firstName,
      personLastName: Person.lastName,

      contactEmail: Contact.email,

      statusId: LeadStatus.id,
      statusValue: LeadStatus.value,
      statusIsActive: LeadStatus.isActive,

      jobId: Job.id,
      jobDescription: Job.description,
      jobAddress: Job.address,
      jobCreatedAt: Job.createdAt,

      jobStatusId: JobStatus.id,
      jobStatusValue: JobStatus.value,
      jobStatusDescription: JobStatus.description,
      jobStatusIsActive: JobStatus.isActive,

      tradeId: Trade.id,
      tradeValue: Trade.value,
    })
    .from(JobLead)
    .leftJoin(Person, eq(Person.id, JobLead.personId))
    .leftJoin(Contact, eq(Contact.personId, Person.id))
    .leftJoin(LeadStatus, eq(LeadStatus.id, JobLead.statusId))
    .leftJoin(Job, eq(Job.id, JobLead.jobId))
    .leftJoin(JobStatus, eq(JobStatus.id, Job.statusId))
    .leftJoin(Trade__JobLead, eq(Trade__JobLead.jobLeadId, JobLead.id))
    .leftJoin(Trade, eq(Trade.id, Trade__JobLead.tradeId))
    .orderBy(
      JobLead.createdAt,
      Trade.value,
    )
}


const parentShape = createParentShape(getBaseQuery)
  .fn(row => ({
    id: row.id,
    description: row.description,
    createdAt: epoch(row.createdAt),

    person: {
      id: prop(row.personId, Person.id),
      imageId: prop(row.personImageId, Person.imageId),
      firstName: prop(row.personFirstName, Person.firstName),
      lastName: prop(row.personLastName, Person.lastName),
      email: prop(row.contactEmail, Contact.email),
    },

    status: {
      id: prop(row.statusId, LeadStatus.id),
      value: prop(row.statusValue, LeadStatus.value),
      isActive: prop(row.statusIsActive, LeadStatus.isActive),
    },

    job: nested(row.jobId, {
      id: prop(row.jobId, Job.id),
      description: prop(row.jobDescription, Job.description),
      address: prop(row.jobAddress, Job.address),
      createdAt: epoch(row.jobCreatedAt),
      status: nested(row.jobStatusId, {
        id: prop(row.jobStatusId, JobStatus.id),
        value: prop(row.jobStatusValue, JobStatus.value),
        description: prop(row.jobStatusDescription, JobStatus.description),
        isActive: prop(row.jobStatusIsActive, JobStatus.isActive),
      }),
    }),
  }))


function getChildren() {
  return createChildren(getBaseQuery)
    .fn({
      prop: 'trades',
      id: (row) => row.tradeId,
      shape: (row) => ({
        id: prop(row.tradeId, Trade.id),
        value: prop(row.tradeValue, Trade.value),
      }),
    })
}


export async function queryJobLeads() {
  return leftJoin(await getBaseQuery(), {
    children: getChildren(),
    parent: { shape: parentShape },
  })
}


export async function queryJobLead(id: number) {
  const rows = await getBaseQuery()
    .where(eq(JobLead.id, id))

  const [jobLead] = leftJoin(rows, {
    children: getChildren(),
    parent: { shape: parentShape },
  })

  return jobLead
}


export type QueryJobLead = InferQuery<typeof queryJobLead>


export type QueryJobLeads = InferQuery<typeof queryJobLeads>