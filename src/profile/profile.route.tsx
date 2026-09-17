// app/src/profile/profile.route.tsx


import { Hono } from 'hono'
import { Field } from '@hono-form'
import { css, Style } from 'hono/css'
import { idAvatar } from '@src/lib/dom'
import { createRPC } from '@hono-api/be'
import type { AppType } from '@src/index'
import { queryStaffPerson } from '@src/db'
import { getSession } from '@src/auth/getSession'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { Accordion, type AccordionItem } from '@hono-accordion'
import { mdAccordion, onProfileUpdateLoad } from '@hono-directives'


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
            <img id={idAvatar().id} class={resSession.response.person.imageId ? '' : 'hidden'} src={`https://r2.shastatrades.org/${resSession.response.person.imageId}.webp`} />
            <button type="submit" class="primary">Save</button>
          </form>
        </>
      }
    ]

    if (resStaff?.positions.length) {
      accordionItems.push({
        header: 'Objective Activity',
        body: <>
          <div class="feed">

            {/* Column Changed */}
            <div class="event">
              <div class="icon move" aria-hidden="true">→</div>
              <div class="body">
                <div class="text">
                  <strong>Christopher Carrington</strong> moved <strong><a href="/objectives?id=12" target="_blank">Trust Document</a></strong> from
                  <span class="chip column in-progress">In Progress</span> to
                  <span class="chip column completed">Completed</span>
                </div>
                <time class="time">26 minutes ago</time>
              </div>
            </div>

            {/* Comment Added */}
            <div class="event">
              <div class="icon comment" aria-hidden="true">💬</div>
              <div class="body">
                <div class="text">
                  <strong>Megha Carrington</strong> commented on <strong><a href="/objectives?id=16" target="_blank">Articles of Incorporation</a></strong>
                </div>
                <div class="comment-preview">
                  Deployed some loveliness in the 530 ho! Peep it or get clapped westside represent!
                </div>
                <time class="time">3 hours ago</time>
              </div>
            </div>

            {/* Assignee Added  */}
            <div class="event">
              <div class="icon add" aria-hidden="true">＋</div>
              <div class="body">
                <div class="text">
                  <strong>Megha Carrington</strong> assigned
                  <span class="chip assignee">Christopher Carrington</span>
                  to <strong><a href="/objectives?id=17" target="_blank">Bylaws</a></strong>
                </div>
                <time class="time">2 minutes ago</time>
              </div>
            </div>

            {/* Column Changed */}
            <div class="event">
              <div class="icon move" aria-hidden="true">→</div>
              <div class="body">
                <div class="text">
                  <strong>Cindi Joy Staller</strong> moved <strong><a href="/objectives?id=12" target="_blank">Trust Document</a></strong> from
                  <span class="chip column todo">To Do</span> to
                  <span class="chip column in-progress">In Progress</span>
                </div>
                <time class="time">26 minutes ago</time>
              </div>
            </div>

            {/* Tag Added */}
            <div class="event">
              <div class="icon tag" aria-hidden="true">◆</div>
              <div class="body">
                <div class="text">
                  <strong>Megha Carrington</strong> added the tag
                  <span class="chip tag">In Development</span>
                  to <strong><a href="/objectives?id=14" target="_blank">Whistleblower Policy</a></strong>
                </div>
                <time class="time">1 hour ago</time>
              </div>
            </div>

            {/* Assignee Removed */}
            <div class="event">
              <div class="icon remove" aria-hidden="true">－</div>
              <div class="body">
                <div class="text">
                  <strong>Cindi Joy Staller</strong> removed
                  <span class="chip assignee">Megha Carrington</span>
                  from <strong><a href="/objectives?id=12" target="_blank">Trust Document</a></strong>
                </div>
                <time class="time">Yesterday at 4:12 PM</time>
              </div>
            </div>

            {/* Tag Removed */}
            <div class="event">
              <div class="icon tag" aria-hidden="true">◆</div>
              <div class="body">
                <div class="text">
                  <strong>Megha Carrington</strong> removed the tag
                  <span class="chip tag">Ready for QA</span>
                  from <strong><a href="/objectives?id=15" target="_blank">Conflict of Interest Policy</a></strong>
                </div>
                <time class="time">Yesterday at 9:03 AM</time>
              </div>
            </div>
          </div>
        </>
      })
    }

    return c.render(
      <>
        <title>Shasta Trades · Profile</title>
        <Style>{style}</Style>
        <Style>{subPageHeroStyle}</Style>

        <div class="profile" data-directive={mdAccordion()}>
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


export const style = css`
  .profile {
    .form-card {
      margin-top: var(--space-lite) !important;

      #avatar {
        max-width: 100%;
        margin-bottom: var(--space-lite);
        &.hidden {
          display: none;
        }
      }
    }

    .feed {
      position: relative;
      padding-top: var(--space-lite);
      &::before {
        content: '';
        position: absolute;
        left: 1.9rem;
        top: 1.2rem;
        bottom: 1.2rem;
        width: 0.1rem;
        background: #ececec;
      }

      .event {
        position: relative;
        display: flex;
        gap: 1.6rem;
        padding-bottom: 2.8rem;
        &:last-child {
          padding-bottom: 0;
        }

        .icon {
          position: relative;
          z-index: 1;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          flex-shrink: 0;
          background: #ffffff;
          box-shadow: 0 0 0 0.4rem #ffffff;
          &.add {
            background: #ecfdf5;
            color: #059669;
          }
          &.remove {
            background: #fef2f2;
            color: #dc2626;
          }
          &.move {
            background: #eff6ff;
            color: #2563eb;
          }
          &.tag {
            background: #fdf4ff;
            color: #c026d3;
          }
          &.comment {
            background: #fff7ed;
            color: #ea580c;
          }
        }

        .body {
          flex: 1;
          min-width: 0;
          padding-top: 0.6rem;

          .text {
            color: #2b2b2b;

            strong {
              font-weight: 600;
              color: #111111;

              a {
                color: #1e293b;
                text-decoration: none;
                &:hover {
                  text-decoration: underline;
                }
              }
            }

            .chip,
            .assignee {
              margin: 0 0.6rem;
            }

            .chip {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.2rem 0.9rem;
              border-radius: 99rem;
              font-size: 1.61rem;
              font-weight: 500;
              vertical-align: middle;
              white-space: nowrap;
            }

            .assignee {
              border: 1px solid #ef4444;
              background: linear-gradient(to bottom, rgba(239, 68, 68, 0.08), transparent);
              color: #dc0000;
            }

            .tag {
              background: #fdf4ff;
              color: #a21caf;
              border: 0.1rem solid #a21caf;
            }

            .column {
              border: 0.1rem solid transparent;
              &.todo {
                color: #6366f1;
                border-color: #6366f1;
                background: linear-gradient(to bottom, rgba(99, 102, 241, 0.08), transparent);
              }
              &.in-progress {
                color: #cc8100;
                border-color: #f59e0b;
                background: linear-gradient(to bottom, rgba(245, 158, 11, 0.08), transparent);
              }
              &.completed {
                color: #02a36e;
                border-color: #10b981;
                background: linear-gradient(to bottom, rgba(16, 185, 129, 0.08), transparent);
              }
            }
          }

          .time {
            display: block;
            font-size: 1.5rem;
            color: #9a9a9a;
            margin-top: 0.4rem;
          }

          .comment-preview {
            margin-top: var(--space-lite);
            padding: var(--space-lite);
            background: #fafafa;
            border-left: 0.3rem solid #e5e5e5;
            border-radius: 0 0.8rem 0.8rem 0;
            color: #4b4b4b;
            line-height: 1.6;
            margin-bottom: calc(var(--space-lite) / 2);
            font-size: 90%;
          }
        }
      }
    }
  }
`
