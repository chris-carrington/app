// app/src/lib/vars.ts

import type { ObjectiveColumn } from '@src/db'
import { msMinute, msWeek, secWeek, type HashCreateProps } from '@hono-security'


export const sessionCookieName = 'session'

export const msSessionMaxAge = msWeek * 9

export const secSessionMaxAge = secWeek * 9

/** IF a request is made w/ a session & the expiry is less then `sessionRenewalWindow` THEN increase cookie + db expiry to sessionMaxAge */
export const sessionRenewalWindow = secWeek

export const magicLinkTokenHashCreateProps: Omit<HashCreateProps, 'password'> = {
  saltLength: 0,
  iterations: 1,
  hashFn: 'SHA-256'
}

export const magicTokenMaxAge = msMinute * 9

export const emailFrom = 'support@shastatrades.org'

export const kanbanColumns: typeof ObjectiveColumn.$inferSelect[] = [
  { id: 1, value: 'To Do', isActive: true },
  { id: 2, value: 'In Progress', isActive: true },
  { id: 3, value: 'Completed', isActive: true }
]

export const serverErrorMessage = `An unexpected error happened, I'm sorry, please feel free to try again or contact us to help bring this error to our awareness`
