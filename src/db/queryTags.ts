// app/src/db/queryTags.ts

import { db, ObjectiveTag } from '@src/db'
import type { InferQuery } from '@drizzle-compose'


function getBaseQuery() {
  return db
    .select({
      id: ObjectiveTag.id,
      value: ObjectiveTag.value,
      order: ObjectiveTag.order,
      bgHex: ObjectiveTag.bgHex,
      fgHex: ObjectiveTag.fgHex,
    })
    .from(ObjectiveTag)
    .orderBy(ObjectiveTag.order)
}


/** Get all tags */
export async function queryTags() {
  return await getBaseQuery()
}


export type QueryTags = InferQuery<typeof queryTags>
