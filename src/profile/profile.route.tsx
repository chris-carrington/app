// app/src/profile/profile.route.tsx

import { Hono } from 'hono'
import { Field } from '@hono-form'
import { css, Style } from 'hono/css'
import { idAvatar } from '@src/lib/dom'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { getSession } from '@src/auth/getSession'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { Accordion, type AccordionItem } from '@hono-accordion'
import { queryStaffPerson, queryObjectiveActivity } from '@src/db'
import { bindAccordionItems, onProfileUpdateLoad } from '@hono-directives'
import { ObjectiveActivity, objectiveActivityStyle } from '@src/lib/ObjectiveActivity'


export default new Hono()
  .get('/', async (c) => {
    const resSession = await getSession(c, 'include-person-and-contact')

    if (resSession.status === 401) {
      const redirect: string = createRPC<AppType>()['sign-in'].$url().href
      return c.redirect(redirect)
    }

    const resStaff = await queryStaffPerson(resSession.response.person.id)

    const accordionItems: AccordionItem[] = [
      {
        header: 'Edit Profile',
        body: <>
          <form data-directive={onProfileUpdateLoad()} class="form-card bg-white">
            <div class="title">Edit Profile</div>

            <div class="two">
              <Field type="text" label="First Name" name="firstName" prefix="profile-update" value={resSession.response.person.firstName} />
              <Field type="text" label="Last Name" name="lastName" prefix="profile-update" value={resSession.response.person.lastName} />
            </div>

            <Field type="file" label="Avatar" name="img" prefix="profile-update" />
            <img id={avatarId.id} class={resSession.response.person.imageId ? '' : 'hidden'} src={`https://r2.shastatrades.org/${resSession.response.person.imageId}.webp`} />
            <button type="submit" class="primary">Save</button>
          </form>
        </>
      }
    ]

    if (resStaff?.positions.length) {
      const resActivity = await queryObjectiveActivity({ variant: 'personal', sessionPersonId: resSession.response.person.id })

      accordionItems.push({
        header: 'Objective Activity',
        body: <ObjectiveActivity res={resActivity} />
      })
    }

    return c.render(
      <>
        <title>Shasta Trades · Profile</title>
        <Style>{subPageHeroStyle}</Style>
        <Style>{objectiveActivityStyle}</Style>
        <Style>{style}</Style>

        <div class="profile" data-directive={bindAccordionItems()}>
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Profile</h1>
              <div class="sub-title">Welcome {resSession.response.person.firstName} {resSession.response.person.lastName}, thank you for being here!</div>
            </div>
          </div>

          <div class="page-content">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </>
    )
  })


const avatarId = idAvatar()


export const style = css`
  .profile {
    .form-card {
      margin-top: var(--space-lite) !important;

      #${avatarId.id} {
        max-width: 100%;
        margin-bottom: var(--space-lite);
      }
    }
  }
`
