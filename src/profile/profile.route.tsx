// app/src/profile/profile.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { idAvatar } from '@src/lib/dom'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { msDay, Field } from '@hono-form'
import { getSession } from '@src/auth/getSession'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { Accordion, type AccordionItem } from '@hono-accordion'
import { bindAccordionItems, onProfileUpdateLoad, tooltip } from '@hono-directives'
import { ObjectiveActivity, objectiveActivityStyle } from '@src/lib/ObjectiveActivity'
import { queryStaffPerson, queryObjectiveActivity, type Person, type QueryStaffPerson, type QueryObjectiveActivity } from '@src/db'


export default new Hono()
  .get('/', async (c) => {
    const resSession = await getSession(c, 'include-person-and-contact')

    if (resSession.status === 401) {
      const redirect: string = createRPC<AppType>()['sign-in'].$url().href
      return c.redirect(redirect)
    }

    const resStaff: QueryStaffPerson = await queryStaffPerson(resSession.response.person.id)

    const accordionItems = await getAccordionItems(resSession.response.person, resStaff)

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

          <div class="page-content">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </>
    )
  })


const avatarId = idAvatar()


async function getAccordionItems(person: typeof Person.$inferSelect, resStaff: QueryStaffPerson) {

  const accordionItems: AccordionItem[] = []

  if (resStaff?.positions.length) {
    const resActivity = await queryObjectiveActivity({ variant: 'personal', sessionPersonId: person.id })
    const resActivityRecentCount = countItemsInLast24Hours(resActivity)

    accordionItems.push({
      header: <>
        <div class="space-between">
          <span>Objective Activity</span>
          <span data-directive={tooltip('bottomRight', 'The number of objective activity itmes in the last 24 hours! ✅')}>{resActivityRecentCount}</span>
        </div>
      </>,
      body: <ObjectiveActivity res={resActivity} />
    })

    accordionItems.push({
      header: <>
        <div class="space-between">
          <span>Job Leads</span>
          <span>3</span>
        </div>
      </>,
      body: <>
        <section class="bucket service" aria-labelledby="bucket-service">
          <div class="bhead">
            <span class="dot" aria-hidden="true"></span>
            <h2 id="bucket-service">Job Leads</h2>
            <span class="count">3</span>
          </div>
          <div class="entries">

            <article class="entry">
              <div class="who">
                <span class="name">Amanda Reyes</span>
                <a class="email" href="mailto:amanda.reyes@example.com">amanda.reyes@example.com</a>
                <span class="when">2 hours ago</span>
              </div>
              <dl class="fields">
                <dt>Description</dt>
                <dd>Guest bathroom remodel — tub-to-shower conversion, new vanity and tile.</dd>
                <dt>Trades</dt>
                <dd>
                  <ul class="chips">
                    <li>Bathroom</li>
                    <li>Tiling</li>
                    <li>Plumbing</li>
                  </ul>
                </dd>
              </dl>
            </article>

            <article class="entry">
              <div class="who">
                <span class="name">Marcus Webb</span>
                <a class="email" href="mailto:marcus.webb@example.com">marcus.webb@example.com</a>
                <span class="when">Yesterday</span>
              </div>
              <dl class="fields">
                <dt>Description</dt>
                <dd>Back deck is soft in two spots. Looking to replace boards and re-stain before winter.</dd>
                <dt>Trades</dt>
                <dd>
                  <ul class="chips">
                    <li>Deck</li>
                    <li>Carpentry</li>
                    <li>Painting</li>
                  </ul>
                </dd>
              </dl>
            </article>

            <article class="entry">
              <div class="who">
                <span class="name">Donald Cooper</span>
                <a class="email" href="mailto:donald.cooper@example.com">donald.cooper@example.com</a>
                <span class="when">3 days ago</span>
              </div>
              <dl class="fields">
                <dt>Description</dt>
                <dd>Kitchen outlets keep tripping the breaker. Hoping someone can take a look this week.</dd>
                <dt>Trades</dt>
                <dd>
                  <ul class="chips">
                    <li>Electrical</li>
                  </ul>
                </dd>
              </dl>
            </article>

          </div>
        </section>
      </>
    })

    accordionItems.push({
      header: <>
        <div class="space-between">
          <span>Staff Leads</span>
          <span>2</span>
        </div>
      </>,
      body: <>
        <section class="bucket lead" aria-labelledby="bucket-lead">
          <div class="bhead">
            <span class="dot" aria-hidden="true"></span>
            <h2 id="bucket-lead">Staff Leads</h2>
            <span class="count">2</span>
          </div>
          <div class="entries">

            <article class="entry">
              <div class="who">
                <span class="name">Jordan Ellis</span>
                <a class="email" href="mailto:jordan.ellis@example.com">jordan.ellis@example.com</a>
                <span class="when">5 hours ago</span>
              </div>
              <dl class="fields">
                <dt>Position</dt>
                <dd>CFO</dd>
              </dl>
            </article>

            <article class="entry">
              <div class="who">
                <span class="name">Sofia Nguyen</span>
                <a class="email" href="mailto:sofia.nguyen@example.com">sofia.nguyen@example.com</a>
                <span class="when">2 days ago</span>
              </div>
              <dl class="fields">
                <dt>Position</dt>
                <dd>Tradesperson</dd>
              </dl>
            </article>

          </div>
        </section>
      </>
    })

    accordionItems.push({
      header: <>
        <div class="space-between">
          <span>Contact Us Messages</span>
          <span>2</span>
        </div>
      </>,
      body: <>
        <section class="bucket contact" aria-labelledby="bucket-contact">
          <div class="bhead">
            <span class="dot" aria-hidden="true"></span>
            <h2 id="bucket-contact">Contact Us Messages</h2>
            <span class="count">2</span>
          </div>
          <div class="entries">

            <article class="entry">
              <div class="who">
                <span class="name">Daniel Cho</span>
                <a class="email" href="mailto:daniel.cho@example.com">daniel.cho@example.com</a>
                <span class="when">8 hours ago</span>
              </div>
              <dl class="fields">
                <dt>Message</dt>
                <dd>Do you serve Weed and Dunsmuir, or is it Mount Shasta only? Thanks!</dd>
              </dl>
            </article>

            <article class="entry">
              <div class="who">
                <span class="name">Grace Lindqvist</span>
                <a class="email" href="mailto:grace.lindqvist@example.com">grace.lindqvist@example.com</a>
                <span class="when">3 days ago</span>
              </div>
              <dl class="fields">
                <dt>Message</dt>
                <dd>I'd love to volunteer for the next community build day — how do I get on the list?</dd>
              </dl>
            </article>

          </div>
        </section>
      </>
    })

    accordionItems.push({
      header: <>
        <div class="space-between">
          <span>Newsletter Signups</span>
          <span>3</span>
        </div>
      </>,
      body: <>
        <section class="bucket news" aria-labelledby="bucket-news">
          <div class="bhead">
            <span class="dot" aria-hidden="true"></span>
            <h2 id="bucket-news">Newsletter Signups</h2>
            <span class="count">3</span>
          </div>
          <div class="entries">

            <article class="entry">
              <div class="who">
                <span class="name">Elena Park</span>
                <a class="email" href="mailto:elena.park@example.com">elena.park@example.com</a>
                <span class="when">20 minutes ago</span>
              </div>
            </article>

            <article class="entry">
              <div class="who">
                <span class="name">Tom Bradley</span>
                <a class="email" href="mailto:tom.bradley@example.com">tom.bradley@example.com</a>
                <span class="when">Yesterday</span>
              </div>
            </article>

            <article class="entry">
              <div class="who">
                <span class="name">Ruth Okafor</span>
                <a class="email" href="mailto:ruth.okafor@example.com">ruth.okafor@example.com</a>
                <span class="when">4 days ago</span>
              </div>
            </article>

          </div>
        </section>
      </>
    })
  }

  accordionItems.push({
    header: 'Edit Your Profile',
    body: <>
      <form data-directive={onProfileUpdateLoad()} class="form-card bg-white">
        <div class="title">Edit Your Profile</div>

        <div class="two">
          <Field type="text" label="First Name" name="firstName" prefix="profile-update" value={person.firstName} />
          <Field type="text" label="Last Name" name="lastName" prefix="profile-update" value={person.lastName} />
        </div>

        <Field type="file" label="Avatar" name="img" prefix="profile-update" />
        <img id={avatarId.id} class={person.imageId ? '' : 'hidden'} src={`https://r2.shastatrades.org/${person.imageId}.webp`} />
        <button type="submit" class="primary">Save</button>
      </form>
    </>
  })

  return accordionItems
}



function countItemsInLast24Hours(res: QueryObjectiveActivity): number {
  let count = 0
  const nowMs = Date.now()
  const cutoffMs = nowMs - msDay

  for (const item of res.items) {
    if (item.createdAtMs >= cutoffMs && item.createdAtMs <= nowMs) count++
    else break
  }

  return count
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

    .page-content {
      max-width: 69rem;
    }

    .accordion-title {
      .space-between {
        display: flex;
        justify-content: space-between;

        span {
          &:last-child {
              padding: 0.3rem 1.1rem;
              font-size: 1.2rem;
              font-weight: 700;
              color: var(--white);
              background: var(--primary);
              border-radius: 50%;
              height: 2.1rem;
              width: 2.1rem;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 0.3rem;
              margin-right: 0.6rem;
          }
        }
      }
    }

    .form-card {
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

      &.news {
        --accent: #97650f;
        --tint: #fbf1dd;
      }

      &.contact {
        --accent: #b03f68;
        --tint: #fbe9f0;
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
            min-width: 13.6rem;
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
            font-size: 1.2rem;
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
  }
`
