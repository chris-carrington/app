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
export { upsertPerson } from '@src/db/upsertPerson'
export { upsertContact } from '@src/db/upsertContact'


// tables
export { Contact } from '@src/db/schema/Contact'
export { ContactUsMessage } from '@src/db/schema/ContactUsMessage'
export { Job__Client } from '@src/db/schema/Job__Client'
export { Job__Trade } from '@src/db/schema/Job__Trade'
export { Job } from '@src/db/schema/Job'
export { JobLead } from '@src/db/schema/JobLead'
export { JobStatus } from '@src/db/schema/JobStatus'
export { LeadStatus } from '@src/db/schema/LeadStatus'
export { MagicToken } from '@src/db/schema/MagicToken'
export { Person__StaffPosition } from '@src/db/schema/Person__StaffPosition'
export { Person } from '@src/db/schema/Person'
export { Session } from '@src/db/schema/Session'
export { StaffEndReason } from '@src/db/schema/StaffEndReason'
export { StaffLead } from '@src/db/schema/StaffLead'
export { StaffPosition } from '@src/db/schema/StaffPosition'
export { Trade__JobLead } from '@src/db/schema/Trade__JobLead'
export { Trade } from '@src/db/schema/Trade'


// types
export type Transaction = SQLiteTransaction<'async', ResultSet, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
