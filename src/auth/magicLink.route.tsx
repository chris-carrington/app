// app/src/auth/magicLink.route.tsx

import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { css, Style } from 'hono/css'
import { urlBE } from '@src/url/urlBE'
import { hashCreate } from '@hono-security'
import type { JSX } from 'hono/jsx/jsx-runtime'
import { setSessionCookie } from './setSessionCookie'
import { db, Person, Contact, MagicToken, Session } from '@src/db'
import { msSessionMaxAge, magicLinkTokenHashCreateProps } from '@src/lib/vars'


export default new Hono()
  .get('/:token', async (c) => {
    const tokenHash = await hashCreate({ password: c.req.param('token'), ...magicLinkTokenHashCreateProps })

    const [result] = await db // get magicToken
      .select()
      .from(MagicToken)
      .innerJoin(Person, eq(MagicToken.personId, Person.id))
      .innerJoin(Contact, eq(Person.id, Contact.personId))
      .where(eq(MagicToken.tokenHash, tokenHash))
      .limit(1)

    const res = validate(result.MagicToken)

    if (res.isValid) {
      const ipAddress = c.req.header('cf-connecting-ip')
      if (!ipAddress) throw new Error('!ipAddress')

      try {
        const session = await db.transaction(async (tx) => {
          const [[session], [magicToken]] = await Promise.all([
            tx.insert(Session) // insert Session
              .values({
                ipAddress,
                personId: result.Person.id,
                expiresAt: new Date(Date.now() + msSessionMaxAge),
              })
              .returning({ id: Session.id }),
            tx.update(MagicToken) // MagicToken.used -> true
              .set({ used: true })
              .where(
                and(
                  eq(MagicToken.id, result.MagicToken.id),
                  eq(MagicToken.used, false)
                )
              )
              .returning({ id: MagicToken.id }),
            tx.update(Contact) // Contact.emailVerified -> true
              .set({ emailVerified: true })
              .where(eq(Contact.id, result.Contact.id))
          ])

          if (!magicToken) throw new Error('Magic token already used')

          return session
        })

        await setSessionCookie(c, String(session.id)) // create cookie
      } catch (error) {
        console.error(error)

        return c.render(
          <>
            <Style>{style}</Style>
            <h1>Something went wrong. Please <a href={urlBE()['sign-in'].$url().href}>sign in</a> again.</h1>
          </>
        )
      }

      const redirect: string = urlBE().profile.$url().href // string cast breaks circular depenency error

      return c.redirect(redirect)
    }

    return c.render(
      <>
        <Style>{style}</Style>
        {res.template}
      </>
    )
  })


function validate(magicToken: typeof MagicToken.$inferSelect): { isValid: true } | { isValid: false, template: JSX.Element } {
  // invalid token
  if (!magicToken) return { isValid: false, template: <h1>Link is invalid, please attempt to <a href={urlBE()['sign-in'].$url().href}>sign in</a> again.</h1> }

  // used token
  if (magicToken.used) return { isValid: false, template: <h1>Link has already been clicked, please attempt to <a href={urlBE()['sign-in'].$url().href}>sign in</a> again.</h1> }

  // expiration is NOT before now
  if (magicToken?.expiresAt.getTime() < Date.now()) return { isValid: false, template: <h1> Link is expired, they are only valid for 9 minutes, please attempt to <a href={urlBE()['sign-in'].$url().href}>sign in</a> again.</h1> }

  // valid
  return { isValid: true }
}


const style = css`
  h1 {
    width: 100%;
    text-align: center;
    padding: var(--space);
    color: var(--primary);
    font-size: 3.2rem;

    a {
      color: var(--orange);
    }
  }
`
