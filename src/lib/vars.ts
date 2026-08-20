// app/src/lib/vars.ts

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
