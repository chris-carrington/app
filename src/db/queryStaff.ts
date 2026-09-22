// app/src/db/queryStaff.ts

import { eq, or, gt, and, lte, isNull } from 'drizzle-orm'
import { db, Person, Session, StaffPosition, StaffEndReason, Person__StaffPosition } from '@src/db'
import { prop, leftJoin, createParentShape, createChildren, type InferQuery } from '@drizzle-compose'


function getBaseQuery() {
  return db
    .select({
      id: Person.id,
      firstName: Person.firstName,
      lastName: Person.lastName,
      imageId: Person.imageId,
      isActive: Person.isActive,

      person__position: Person__StaffPosition.id,
      startDate: Person__StaffPosition.startDate,
      endDate: Person__StaffPosition.endDate,

      positionId: StaffPosition.id,
      positionValue: StaffPosition.value,
      positionIsActive: StaffPosition.isActive,
      positionIsHiring: StaffPosition.isHiring,

      endReasonId: StaffEndReason.id,
      endReasonValue: StaffEndReason.value,
    })
    .from(Person)
    .leftJoin(Person__StaffPosition, eq(Person__StaffPosition.personId, Person.id),)
    .leftJoin(StaffPosition, eq(StaffPosition.id, Person__StaffPosition.positionId),)
    .leftJoin(StaffEndReason, eq(StaffEndReason.id, Person__StaffPosition.endReasonId),)
    .orderBy(Person.id, StaffPosition.value)
}


const parentShape = createParentShape(getBaseQuery)
  .fn(row => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    imageId: row.imageId,
    isActive: row.isActive,
  }))


function getChildren() {
  return createChildren(getBaseQuery)
    .fn({
      prop: 'positions',
      id: (row) => row.person__position,
      shape: (row) => ({
        id: prop(row.positionId, StaffPosition.id),
        value: prop(row.positionValue, StaffPosition.value),
        startDate: row.startDate as unknown as string, // post api layer it'll be a string
        endDate: row.endDate as unknown as string | null, // post api layer it'll be a string | null
        endReasonId: prop(row.endReasonId, StaffEndReason.id),
        endReasonValue: prop(row.endReasonValue, StaffEndReason.value),
      }),
    })
}


/** Get all people who are currently staff */
export async function queryStaffPeople() {
  const rows = await getBaseQuery()
    .where(currentStaffPositionWhere())

  return leftJoin(rows, {
    children: getChildren(),
    parent: { shape: parentShape },
  })
}


/** Get a current staff person by id */
export async function queryStaffPerson(id: number) {
  const rows = await getBaseQuery()
    .where(
      and(
        eq(Person.id, id),
        currentStaffPositionWhere(),
      ),
  )

  if (rows.length === 0) return undefined

  const [person] = leftJoin(rows, {
    children: getChildren(),
    parent: { shape: parentShape },
  })

  return person
}


function currentStaffPositionWhere() {
  const now = new Date()

  return and(
    eq(Person.isActive, true),
    lte(Person__StaffPosition.startDate, now),
    or(
      isNull(Person__StaffPosition.endDate),
      gt(Person__StaffPosition.endDate, now),
    ),
  )
}


/** Joined session + person + current staff positions, keyed off a sessionId */
export async function queryStaffPersonSession(sessionId: number) {
  const now = new Date()

  const getBaseQuery = () => db
    .select({
      session: Session,
      person: Person,

      person__position: Person__StaffPosition.id,
      startDate: Person__StaffPosition.startDate,
      endDate: Person__StaffPosition.endDate,

      positionId: StaffPosition.id,
      positionValue: StaffPosition.value,
      positionIsActive: StaffPosition.isActive,
      positionIsHiring: StaffPosition.isHiring,

      endReasonId: StaffEndReason.id,
      endReasonValue: StaffEndReason.value,
    })
    .from(Session)
    .innerJoin(Person, eq(Session.personId, Person.id))
    .leftJoin(
      Person__StaffPosition,
      and(
        eq(Person__StaffPosition.personId, Person.id),
        lte(Person__StaffPosition.startDate, now),
        or(
          isNull(Person__StaffPosition.endDate),
          gt(Person__StaffPosition.endDate, now),
        ),
      ),
    )
    .leftJoin(StaffPosition, eq(StaffPosition.id, Person__StaffPosition.positionId))
    .leftJoin(StaffEndReason, eq(StaffEndReason.id, Person__StaffPosition.endReasonId))

  const parentShape = createParentShape(getBaseQuery)
    .fn(row => ({
      session: row.session,
      person: row.person,
    }))

  const getChildren = () => createChildren(getBaseQuery)
    .fn({
      prop: 'positions',
      id: (row) => row.person__position,
      shape: (row) => ({
        id: prop(row.positionId, StaffPosition.id),
        value: prop(row.positionValue, StaffPosition.value),
        startDate: row.startDate as unknown as string, // post api layer it'll be a string
        endDate: row.endDate as unknown as string | null, // post api layer it'll be a string | null
        endReasonId: prop(row.endReasonId, StaffEndReason.id),
        endReasonValue: prop(row.endReasonValue, StaffEndReason.value),
      }),
    })

  const rows = await getBaseQuery()
    .where(eq(Session.id, sessionId))
    .all()

  if (rows.length === 0) return undefined

  const [result] = leftJoin(rows, {
    children: getChildren(),
    parent: { shape: parentShape },
  })

  return result
}



export type QueryStaffPerson = InferQuery<typeof queryStaffPerson> | undefined

export type QueryStaffPeople = InferQuery<typeof queryStaffPeople>

export type QueryStaffPersonSession = InferQuery<typeof queryStaffPersonSession>
