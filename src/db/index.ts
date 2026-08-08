import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/web'

const turso = createClient({
  url: env.TURSO_DATABASE_URL!,
  authToken: env.TURSO_AUTH_TOKEN,
})

export default drizzle(turso)
