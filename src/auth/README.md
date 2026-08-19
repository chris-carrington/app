# Auth


## `POST: /api/sign-up`
1. IF new email THEN add to db `Person` & `Contact` (`emailVerified` <- `false`)
1. Sign in flow


## `POST: /api/sign-in`
1. Based on provided email address, get `Person` & `Contact`
1. IF email is invalid THEN respond that we sent them an email (to prevent email enumeration) 
1. Create random token (`magicToken`)
1. Hash `magicToken` (`tokenHash`)
1. Add `tokenHash` to `MagicToken` table (`expiresAt` is `9 minutes from now` & `used` <- `false`)
1. Send email (token in magic link is `magicToken` not `tokenHash`)


## `GET: /magic-link/:token`
1. Hash `magicToken` from URL (`tokenHash`)
1. Get `MagicToken` and `Person` from db
1. IF token is used THEN error page
1. IF token is expired THEN error page
1. Add to `Session` table expires in `9 weeks`
1. Update `MagicToken` table (`used` <- `true`)
1. Update `Contact` table (`emailVerified` <- `true`)
1. Add secure session cookie (cookie value is `session.id`) expires in `9 weeks`
    - `path: '/'`
    - `httpOnly: true`
    - `sameSite: 'Lax'`
    - `maxAge: 9 weeks from now`
    - `secure: env.ENVIRONMENT === 'production'`
1. Redirect to `/profile`


## `GET: /api/session`
1. IF no `session.id` in cookie THEN respond w/ a `401 unauthorized`
1. Get `Session` from db
1. IF db says `Session` is undefined OR expired THEN delete cookie and redirect to `/sign-in`
1. IF db says `Session` expires in less then 1 week then:
    - Update cookie maxAge to `9 weeks` from now
    - Update `Session.expiresAt` in db to `9 weeks` from now


## `GET: /api/guest`
1. IF `session.id` in cookie THEN redirect to `/profile`


## `GET: /api/sessions`
- Returns: `[{ id, ipAddress, expiresAt, createdAt, current }]`
- Powers the "view / delete a session" UI


## `DELETE: /api/sessions/:id`
1. IF owner or certain staff THEN
    - Delete session cookie
    - Delete session in db
