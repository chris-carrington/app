// app/src/auth/magicLink.route.tsx

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { css, Style } from 'hono/css'
import { db, MagicToken } from '@src/db'
import { hashCreate } from '@hono-security'
import { createUrl } from '@src/lib/createUrl'


export default new Hono()
  .get('/:token', async (c) => {
    const tokenHash = await hashCreate({ password: c.req.param('token'), saltLength: 0 })

    const [magicToken] = await db // get magicToken
      .select()
      .from(MagicToken)
      .where(eq(MagicToken.tokenHash, tokenHash))
      .limit(1)

    return c.render(
      <>
        <Style>{style}</Style>
        {getTemplate(magicToken)}
      </>
    )
  })


function getTemplate(magicToken: typeof MagicToken.$inferSelect) {
  // invalid token
  if (!magicToken) return <h1>Link is invalid, please attempt to <a href={createUrl()['sign-in'].$url().href}>sign in</a> again.</h1>

  // used token
  if (magicToken.used) return <h1>Link has already been clicked, please attempt to <a href={createUrl()['sign-in'].$url().href}>sign in</a> again.</h1>

  // expiration is NOT before now
  if (magicToken?.expiresAt.getTime() < Date.now()) return <h1> Link is expired, they are only valid for 9 minutes, please attempt to <a href={createUrl()['sign-in'].$url().href}>sign in</a> again.</h1>

  // valid
  return <h1>Valid Token</h1>
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
