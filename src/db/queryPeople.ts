// app/src/db/queryPeople.ts

import { db, Person } from '@src/db'
import type  { InferQuery } from '@drizzle-compose'


function getBaseQuery() {
  return db
    .select({
      id: Person.id,
      imageId: Person.imageId,
      firstName: Person.firstName,
      lastName: Person.lastName,
    })
    .from(Person)
    .orderBy(Person.id)
}


/** Get all people */
export async function queryPeople() {
  return await getBaseQuery()
}


export type QueryPeople = InferQuery<typeof queryPeople>
