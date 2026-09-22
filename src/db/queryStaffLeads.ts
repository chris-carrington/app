// app/src/db/queryStaffLeads.ts

import { eq } from 'drizzle-orm'
import { db, Person, StaffLead, LeadStatus, StaffPosition, Contact } from '@src/db'
import { prop, leftJoin, createParentShape, type InferQuery, epoch } from '@drizzle-compose'


function getBaseQuery() {
  return db
    .select({
      id: StaffLead.id,
      createdAt: StaffLead.createdAt,

      personId: Person.id,
      personImageId: Person.imageId,
      personFirstName: Person.firstName,
      personLastName: Person.lastName,
      personEmail: Contact.email,

      statusId: LeadStatus.id,
      statusValue: LeadStatus.value,
      statusIsActive: LeadStatus.isActive,

      positionId: StaffPosition.id,
      positionValue: StaffPosition.value,
      positionIsActive: StaffPosition.isActive,
      positionIsHiring: StaffPosition.isHiring,
    })
    .from(StaffLead)
    .leftJoin(Person, eq(Person.id, StaffLead.personId))
    .leftJoin(Contact, eq(Contact.personId, Person.id))
    .leftJoin(LeadStatus, eq(LeadStatus.id, StaffLead.statusId))
    .leftJoin(StaffPosition, eq(StaffPosition.id, StaffLead.positionId))
    .orderBy(
      StaffLead.createdAt,
      LeadStatus.value,
      StaffPosition.value,
    )
}


const parentShape = createParentShape(getBaseQuery)
  .fn(row => ({
    id: row.id,
    createdAt: epoch(row.createdAt),

    person: {
      id: prop(row.personId, Person.id),
      imageId: prop(row.personImageId, Person.imageId),
      firstName: prop(row.personFirstName, Person.firstName),
      lastName: prop(row.personLastName, Person.lastName),
      email: prop(row.personEmail, Contact.email),
    },

    status: {
      id: prop(row.statusId, LeadStatus.id),
      value: prop(row.statusValue, LeadStatus.value),
      isActive: prop(row.statusIsActive, LeadStatus.isActive),
    },

    position: {
      id: prop(row.positionId, StaffPosition.id),
      value: prop(row.positionValue, StaffPosition.value),
      isActive: prop(row.positionIsActive, StaffPosition.isActive),
      isHiring: prop(row.positionIsHiring, StaffPosition.isHiring),
    },
  }))


/** Get all staff leads */
export async function queryStaffLeads() {
  return leftJoin(await getBaseQuery(), {
    parent: { shape: parentShape },
  })
}


/** Get a staff lead by id */
export async function queryStaffLead(id: number) {
  const rows = await getBaseQuery()
    .where(eq(StaffLead.id, id))

  const [staffLead] = leftJoin(rows, {
    parent: { shape: parentShape },
  })

  return staffLead
}


export type QueryStaffLead = InferQuery<typeof queryStaffLead>


export type QueryStaffLeads = InferQuery<typeof queryStaffLeads>
