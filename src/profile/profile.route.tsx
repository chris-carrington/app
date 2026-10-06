// app/src/profile/profile.route.tsx

import { Hono } from 'hono'
import { Field } from '@hono-form'
import { css, Style } from 'hono/css'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { md2html } from '@src/md/md2html'
import { mdStyle } from '@src/md/mdStyle'
import { getSession } from '@src/auth/getSession'
import mdFinances from '@src/profile/finances.md?raw'
import { tabsStyle, Tabs, type Tab } from '@hono-tabs'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { bindAccordionItems, onProfileLoad } from '@hono-directives'
import { objectiveActivityStyle } from '@src/lib/ObjectiveActivity'
import { queryStaffPerson, type Person, type Contact, type QueryStaffPerson } from '@src/db'
import { idAvatar, idContactUsMessages, idEditYourProfile, idFinances, idJobLeads, idObjectiveActivity, idStaffLeads } from '@src/lib/dom'


export default new Hono()
  .get('/', async (c) => {
    const resSession = await getSession(c, 'include-person-and-contact')

    if (resSession.status === 401) {
      const redirect: string = createRPC<AppType>()['sign-in'].$url().href
      return c.redirect(redirect)
    }

    const resStaff: QueryStaffPerson = await queryStaffPerson(resSession.response.person.id)

    const tabs: Tab[] = (!resStaff?.positions.length)
      ? []
      : await getStaffTabs(resSession.response.person) 

    tabs.push(getEditProfileTab(resSession.response.person, resSession.response.contact))

    return c.render(
      <>
        <title>Shasta Trades · Profile</title>
        <Style>{tabsStyle}</Style>
        <Style>{subPageHeroStyle}</Style>
        <Style>{objectiveActivityStyle}</Style>
        <Style>{mdStyle}</Style>
        <Style>{style}</Style>

        <div class="profile">
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Profile</h1>
              <div class="space-between">
                <div class="sub-title">Welcome {resSession.response.person.firstName} {resSession.response.person.lastName}!</div>
                <div class="chips">
                  {
                    resStaff?.positions && resStaff.positions
                      .map((p) => <div className="chip" key={p.id}>{p.value}</div>)
                  }
                </div>
              </div>
            </div>
          </div>

          <div data-directive={onProfileLoad()} class="page-content">
            <Tabs variant="underline" align="center" name="profile" tabs={tabs} />
          </div>
        </div>
      </>
    )
  })


const avatarId = idAvatar()
const financesId = idFinances()


function getEditProfileTab(person: typeof Person.$inferSelect, contact: typeof Contact.$inferSelect): Tab {
  return {
    id: 'edit-your-profile',
    label: 'Edit Your Profile',
    content: <>
      <form id={idEditYourProfile().id} class="form-card bg-white">
        <div class="title">Edit Your Profile</div>

        <div class="two">
          <Field type="text" label="First Name" name="firstName" prefix="profile-update" value={person.firstName} />
          <Field type="text" label="Last Name" name="lastName" prefix="profile-update" value={person.lastName} />
        </div>

        <Field type="file" label="Avatar" name="img" prefix="profile-update" />
        <Field type="checkbox" label="Newsletter" name="newsletter" options={[{ label: 'Receive one monthy Shasta Trades email', value: 'true' }]} value={contact.sendNewsletter ? 'true' : ''} prefix="profile-update" />
        <img id={avatarId.id} class={person.imageId ? '' : 'hidden'} src={`https://r2.shastatrades.org/${person.imageId}.webp`} />
        <button type="submit" class="primary">Save</button>
      </form>
    </>
  }
}


async function getStaffTabs(person: typeof Person.$inferSelect): Promise<Tab[]> {
  const jobLeads = idJobLeads()
  const staffLeads = idStaffLeads()
  const objectiveActivity = idObjectiveActivity()
  const contactUsMessages = idContactUsMessages()
  const elLoading = <img src="/img/loading.svg" class="loading" alt="Loading..." />

  return [
    {
      id: financesId.id,
      label: 'Finances',
      content: <>
        <div data-directive={bindAccordionItems()} id={financesId.id} class="md" dangerouslySetInnerHTML={{ __html: await md2html(mdFinances, { wrapTables: true, enableAccordion: true }) }}></div>
      </>
    },
    {
      id: objectiveActivity.id,
      label: 'Objective Activity',
      content: <div id={objectiveActivity.id}>{elLoading}</div>
    },
    {
      id: jobLeads.id,
      label: 'Job Leads',
      content: <div id={jobLeads.id}>{elLoading}</div>
    },
    {
      id: staffLeads.id,
      label: 'Staff Leads',
      content: <div id={staffLeads.id}>{elLoading}</div>
    },
    {
      id: contactUsMessages.id,
      label: 'Contact Us Messagese',
      content: <div id={contactUsMessages.id}>{elLoading}</div>
    },
  ]
}





export const style = css`
  .profile {
    .sub-page-hero {
      .space-between {
        display: flex;
        gap: var(--space);
        justify-content: space-between;

        @media (max-width: 720px) {
          flex-direction: column;
        }

        .chips {
          display: flex;
          justify-content: end;
          flex-grow: 1;
          gap: calc(var(--space-lite) / 2);

          @media (max-width: 720px) {
            flex-wrap: wrap;
            flex-grow: 0;
            justify-content: center;
          }

          .chip {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3rem;
            opacity: 0.90;
            background-color: var(--primary);
            border: 1px solid rgba(249, 251, 249, 0.24);
            color: #f9fbf9;
            -webkit-box-shadow: -4px 5px 8px -2px rgba(0,0,0,0.53); 
            box-shadow: -4px 5px 8px -2px rgba(0,0,0,0.53);
            font-size: 81%;
            transition: var(--fast-transition);
            padding: 0.1rem 0.9rem;
            border-radius: calc(var(--radius) * 3);
            white-space: nowrap;
          }
        }
      }
    }

    .form-card {
      margin-top: 0;
      margin-inline: auto !important;

      #${avatarId.id} {
        max-width: 100%;
        margin-bottom: var(--space-lite);
      }
    }

    .bucket {
      --accent: #2f6f8f;
      --tint: #eaf2f7;

      background: #ffffff;
      border: 0.1rem solid #e4e8ee;
      border-radius: 1.8rem;
      box-shadow:
        0 0.2rem 0.4rem rgba(29, 36, 48, 0.04),
        0 1.6rem 2.8rem -1.8rem rgba(29, 36, 48, 0.22);
      overflow: hidden;

      &.service {
        --accent: #1f7a63;
        --tint: #e7f4ef;
      }

      &.lead {
        --accent: #4b5bd6;
        --tint: #eceefc;
      }

      &.contact {
        --accent: #97650f;
        --tint: #fbf1dd;
      }

      .bhead {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding: 1.8rem 2.4rem;
        background: var(--tint);
        border-bottom: 0.1rem solid #e4e8ee;

        .dot {
          width: 1rem;
          height: 1rem;
          flex: none;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 0.4rem #ffffff;
        }

        h2 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.01rem;
          color: #17202c;
        }

        .count {
          margin-left: auto;
          padding: 0.3rem 1.1rem;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent);
          background: #ffffff;
          border-radius: 999rem;
        }
      }

      /* ---------- entry ---------- */

      .entry {
        padding: 2rem 2.4rem;
        border-top: 0.1rem solid #eef1f5;
        transition: background-color 0.15s ease;

        &:first-child {
          border-top: 0;
        }

        &:hover {
          background: #fafbfc;
        }

        .who {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.4rem 1.2rem;

          .name {
            font-size: 1.6rem;
            font-weight: 600;
            color: #131b26;
            min-width: 13.3rem;
          }

          .email {
            font-size: 81%;
            color: #5f6a7a;
            text-decoration: none;

            &:hover {
              color: var(--accent);
              text-decoration: underline;
            }
          }

          .when {
            margin-left: auto;
            font-size: 81%;
            color: #98a1ae;
            white-space: nowrap;
          }
        }

        .fields {
          display: grid;
          grid-template-columns: 13rem 1fr;
          gap: 0.8rem 1.6rem;
          margin: 1.4rem 0 0;

          @media (max-width: 52rem) {
            grid-template-columns: 1fr;
            gap: 0.2rem 0;

            dd {
              margin-bottom: 0.8rem;
            }
          }

          dt {
            padding-top: 0.3rem;
            font-size: 1.15rem;
            font-weight: 700;
            letter-spacing: 0.08rem;
            text-transform: uppercase;
            color: #8d97a5;
          }

          dd {
            margin: 0;
            color: #2c3542;
          }
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;

          li {
            padding: 0.2rem 1rem;
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--accent);
            background: var(--tint);
            border-radius: 999rem;
          }
        }
      }
    }

    .tabs__contents {
      .loading {
        display: block;
        margin: 0 auto;
      }

      #${financesId.id} {
        max-width: 108rem;
      }
    }
  }
`
