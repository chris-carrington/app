// app/src/db/schema/ContactUsMessage.ts

import { Person } from '@src/db'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store messages that are filled out with our Contact Us website form */
export const ContactUsMessage = sqliteTable('ContactUsMessage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  personId: integer('personId')
    .notNull()
    .references(() => Person.id),
  message: text('message').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})


export const ContactUsMessageRelations = relations(ContactUsMessage, ({ one }) => ({
  person: one(Person, {
    fields: [ContactUsMessage.personId],
    references: [Person.id],
  }),
}))
