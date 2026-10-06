// app/src/api/staffLeads.api.tsx

import { Hono } from 'hono'
import { queryStaffLeads } from '@src/db'
import { formatTime } from '@src/time/formatTime'
import { mwSessionPersonStaff } from '@src/middleware/mwSessionPersonStaff'


export default new Hono()
  .get(
    '/',
    mwSessionPersonStaff,
    async (c) => {
      const res = await queryStaffLeads()

      return c.html(
        <section class="bucket lead" aria-labelledby="bucket-lead">
          <div class="bhead">
            <span class="dot" aria-hidden="true"></span>
            <h2 id="bucket-lead">Staff Leads</h2>
            <span class="count">{res.length}</span>
          </div>
          <div class="entries">
            {
              res.map(staffLead => <>
                <article class="entry">
                  <div class="who">
                    <span class="name">{staffLead.person.firstName} {staffLead.person.lastName}</span>
                    <a class="email" href={`mailto${staffLead.person.email}`}>{staffLead.person.email}</a>
                    <span class="when" data-directive={formatTime(staffLead.createdAt)}></span>
                  </div>
                  <dl class="fields">
                    <dt>Position</dt>
                    <dd>{staffLead.position.value}</dd>
                  </dl>
                </article>
              </>)
            }

          </div>
        </section>
      )
    }
  )
