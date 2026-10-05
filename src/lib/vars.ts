// app/src/lib/vars.ts

import { msMinute, msWeek, secWeek, type HashCreateProps } from '@hono-form'


export const sessionCookieName = 'session'

export const msSessionMaxAge = msWeek * 9

export const secSessionMaxAge = secWeek * 9

/** IF a request is made w/ a session & the expiry is less then `sessionRenewalWindow` THEN increase cookie + db expiry to sessionMaxAge */
export const sessionRenewalWindow = secWeek

/** 
 * - No salt makes the hash deterministic (db queryable)
 * - SHA-256 + 1 iteration is fine b/c this is a random password (hard to guess, not password123)
 */
export const magicLinkTokenHashCreateProps: Omit<HashCreateProps, 'password'> = {
  saltLength: 0,
  iterations: 1,
  hashFn: 'SHA-256'
}

/** 9 minutes */
export const magicTokenMaxAge = msMinute * 9

export const emailFrom = 'support@shastatrades.org'

export const patience = 'Once our Trust and Nonprofit have been approved by the State of California we will start offering trade services to Siskiyou County! 💚'
