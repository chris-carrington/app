// app/src/db/index.ts

import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/libsql'
import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import { createClient, type ResultSet } from '@libsql/client/web'


const turso = createClient({
  url: env.TURSO_DATABASE_URL!,
  authToken: env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(turso)

export type Transaction = SQLiteTransaction<'async', ResultSet, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>
