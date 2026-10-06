// app/src/api/contactUsMessages.api.tsx

import { Hono } from 'hono'
import { queryContactUsMessages } from '@src/db'
import { formatTime } from '@src/time/formatTime'
import { mwSessionPersonStaff } from '@src/middleware/mwSessionPersonStaff'


export default new Hono()
  .get(
    '/',
    mwSessionPersonStaff,
    async (c) => {
      const res = await queryContactUsMessages()

      return c.html(
        <section class="bucket contact" aria-labelledby="bucket-contact">
          <div class="bhead">
            <span class="dot" aria-hidden="true"></span>
            <h2 id="bucket-contact">Contact Us Messages</h2>
            <span class="count">{res.length}</span>
          </div>
          <div class="entries">
            {
              res.map(m => <>
                <article class="entry">
                  <div class="who">
                    <span class="name">{m.person.firstName} {m.person.lastName}</span>
                    <a class="email" href={`mailto${m.person.email}`}>{m.person.email}</a>
                    <span class="when" data-directive={formatTime(m.createdAt)}></span>
                  </div>
                  <dl class="fields">
                    <dt>Message</dt>
                    <dd>{m.message}</dd>
                  </dl>
                </article>
              </>)
            }
          </div>
        </section>
      )
    }
  )
