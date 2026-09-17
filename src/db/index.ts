// app/src/db/index.ts

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import { createClient, type ResultSet } from '@libsql/client/web'


// db
export const db = drizzle(createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
}))


// queries
export * from '@src/db/queryTags'
export * from '@src/db/queryPeople'
export * from '@src/db/queryStaff'
export * from '@src/db/inupObjective'
export * from '@src/db/queryObjectiveActivity'
export * from '@src/db/queryObjective'
export * from '@src/db/putPersonContact'


// tables
export * from '@src/db/schema/Contact'
export * from '@src/db/schema/ContactUsMessage'
export * from '@src/db/schema/Job__Client'
export * from '@src/db/schema/Job__Trade'
export * from '@src/db/schema/Job'
export * from '@src/db/schema/JobLead'
export * from '@src/db/schema/JobStatus'
export * from '@src/db/schema/LeadStatus'
export * from '@src/db/schema/MagicToken'
export * from './schema/Objective__Assignee'
export * from './schema/Objective__Tag'
export * from './schema/Objective'
export * from './schema/ObjectiveActivity'
export * from './schema/ObjectiveActivityType'
export * from './schema/ObjectiveColumn'
export * from './schema/ObjectiveComment__Assignee'
export * from './schema/ObjectiveComment'
export * from './schema/ObjectiveTag'
export * from '@src/db/schema/Person__StaffPosition'
export * from '@src/db/schema/Person'
export * from '@src/db/schema/Session'
export * from '@src/db/schema/StaffEndReason'
export * from '@src/db/schema/StaffLead'
export * from '@src/db/schema/StaffPosition'
export * from '@src/db/schema/Trade__JobLead'
export * from '@src/db/schema/Trade'


export const OBJECTIVE_ACTIVITY_TYPE_ID = {
  ASSIGNEE_ADDED: 1,
  ASSIGNEE_REMOVED: 2,
  COLUMN_CHANGED: 3,
  TAG_ADDED: 4,
  TAG_REMOVED: 5,
  COMMENT_ADDED: 6,
} as const


// types
export type Transaction = SQLiteTransaction<'async', ResultSet, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
