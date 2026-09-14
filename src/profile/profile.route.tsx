// app/src/profile/profile.route.tsx


import { Hono } from 'hono'
import { Field } from '@hono-form'
import { css, Style } from 'hono/css'
import { idAvatar } from '@src/lib/dom'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { getSession } from '@src/auth/getSession'
import { onProfileUpdate } from '@hono-directives'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'


export default new Hono()
  .get('/', async (c) => {
    const res = await getSession(c, 'include-person-and-contact')

    const redirect: string = createRPC<AppType>()['sign-in'].$url().href

    return res.status === 401
      ? c.redirect(redirect)
      : c.render(
        <>
          <title>Shasta Trades · Profile</title>
          <Style>{style}</Style>
          <Style>{subPageHeroStyle}</Style>

          <div class="profile">
            <div class="sub-page-hero">
              <div class="bg"></div>
              <div class="header">
                <h1>Profile</h1>
              </div>
            </div>

            <form data-directive={onProfileUpdate()} class="form-card bg-white">
              <div class="title">Edit Profile</div>

              <div class="two">
                <Field type="text" label="First Name" name="firstName" prefix="profile-update" value={res.response.person.firstName} />
                <Field type="text" label="Last Name" name="lastName" prefix="profile-update" value={res.response.person.lastName} />
              </div>

              <Field type="file" label="Avatar" name="img" prefix="profile-update" />
              <img id={idAvatar().id} class={res.response.person.imageId ? '' : 'hidden'} src={`https://r2.shastatrades.org/${res.response.person.imageId}.webp`} />
              <button type="submit" class="primary">Save</button>
            </form>

          </div>
        </>
      )
  })


export const style = css`
  .profile {
    .form-card {
      #avatar {
        max-width: 100%;
        margin-bottom: var(--space-lite);
        &.hidden {
          display: none;
        }
      }
    }
  }
`
