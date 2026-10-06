// app/src/api/jobLeads.api.tsx

import { Hono } from 'hono'
import { queryJobLeads } from '@src/db'
import { formatTime } from '@src/time/formatTime'
import { mwSessionPersonStaff } from '@src/middleware/mwSessionPersonStaff'


export default new Hono()
  .get(
    '/',
    mwSessionPersonStaff,
    async (c) => {
      const res = await queryJobLeads()

      return c.html(
        <section class="bucket service" aria-labelledby="bucket-service">
          <div class="bhead">
            <span class="dot" aria-hidden="true"></span>
            <h2 id="bucket-service">Job Leads</h2>
            <span class="count">{res.length}</span>
          </div>
          <div class="entries">
            {
              res.map(jobLead => <>
                <article class="entry">
                  <div class="who">
                    <span class="name">{jobLead.person.firstName} {jobLead.person.lastName}</span>
                    <a class="email" href={`mailto${jobLead.person.email}`}>{jobLead.person.email}</a>
                    <span class="when" data-directive={formatTime(jobLead.createdAt)}></span>
                  </div>
                  <dl class="fields">
                    <dt>Description</dt>
                    <dd>{jobLead.description}</dd>
                    <dt>Trades</dt>
                    <dd>
                      <ul class="chips">
                        { jobLead.trades.map(trade => <li>{trade.value}</li>) }
                      </ul>
                    </dd>
                  </dl>
                </article>
              </>)
            }
          </div>
        </section>
      )
    }
  )
