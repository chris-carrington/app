// app/src/lib/Pattern.tsx

import type { FC } from 'hono/jsx'
import { Field } from '@hono-form'
import { patience } from '@src/lib/vars'
import svgLock from '@src/svg/lock.svg?raw'
import svgFrequency from '@src/svg/frequency.svg?raw'
import { dsStaff } from '@src/dataStructures/staff.ds'
import { dsTrades } from '@src/dataStructures/trades.ds'
import { dsHomeFormIds, dsHomeForms } from '@src/dataStructures/homeForms.ds'
import { onHashChange, onContactUsSubmit, onServiceRequestSubmit, onJoinLeadershipSubmit, onJoinNewsletterSubmit, tooltip } from '@hono-directives'


export default (() => {
  return <>
    <div class="pattern">
      <div class="bg" />
      <Forms />
    </div>
  </>
}) satisfies FC


const Forms: FC = () => {
  return <>
    <div class="forms" data-directive={onHashChange()}>
      <div class="explain">🤝 Want to connect with us?</div>

      <div class="buttons">
        {dsHomeForms.map(a => <a href={'#' + a.id} class="transparent big">{a.title}</a>)}
      </div>

      <ServiceRequest />
      <JoinLeadership />
      <JoinNewsletter />
      <ContactUs />
    </div>
  </>
}


const ServiceRequest: FC = () => {
  const id = dsHomeFormIds[0]
  if (!id) throw new Error('!id')

  return <>
    <div id={id} class="form hidden">
      <div class="badge">COMMUNITY SERVICES</div>
      <div class="flex">
        <div class="left">
          <div class="title">Professional Service</div>
          <div class="description">Our master trade professionals lead every project, ensuring lovely results and hands-on education. Our services include:</div>
          <div class="items">
            {dsTrades.map(item => <>
              <div class="item">
                <div class="icon" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
                <div class="info">
                  <div class="primary">{item.label}</div>
                  <div class="secondary">{item.description}</div>
                </div>
              </div>
            </> )}
          </div>
        </div>

        <div class="right">
          <div class="mask"></div>
          <div class="inputs">
            <div class="title">Hire Trade Professionals</div>
            <form data-directive={onServiceRequestSubmit()} class="bg-pattern">
              <div class="two">
                <Field name="firstName" placeholder="First Name" type="text" prefix={id}/>
                <Field name="lastName" placeholder="Last Name" type="text" prefix={id} />
              </div>

              <Field name="email" placeholder="Email" type="email" prefix={id} />

              <Field name="description" placeholder="Job Description" type="textarea" prefix={id} />
              <Field name="trade" type="checkbox" options={dsTrades} prefix={id} />

              <button data-directive={tooltip('topCenter', patience)} class="orange wide" type="submit">Hire Trade Professionals</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}


const JoinLeadership: FC = () => {
  const id = dsHomeFormIds[1]
  if (!id) throw new Error('!id')

  return <>
    <div id={id} class="form hidden">
      <div class="badge">BE THE LEADER YOU'D FOLLOW</div>
      <div class="flex">
        <div class="left">
          <div class="title">Lead by Example</div>
          <div class="description">We are uniting a visionary Board and dedicated Staff to lead by example! Current openings include:</div>
          <div class="items">
            {dsStaff.map(item => <>
              <div class="item">
                <div class="icon" dangerouslySetInnerHTML={{__html: item.icon}}></div>
                <div class="info">
                  <div class="primary">{item.label}</div>
                  <div class="secondary">{item.description}</div>
                </div>
              </div>
            </> )}
          </div>
        </div>

        <div class="right">
          <div class="mask"></div>
          <div class="inputs">
            <div class="title">Join Leadership Team</div>
            <form data-directive={onJoinLeadershipSubmit()} class="bg-pattern">
              <div class="two">
                <Field name="firstName" placeholder="First Name" type="text" prefix={id} />
                <Field name="lastName" placeholder="Last Name" type="text" prefix={id} />
              </div>

              <Field name="email" placeholder="Email" type="email" prefix={id} />
              <Field name="interest" placeholder="Select Interested Position" type="select" options={dsStaff} prefix={id} />
              <button class="orange wide" type="submit">Join Leadership Team</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}


const JoinNewsletter: FC = () => {
  const id = dsHomeFormIds[2]
  if (!id) throw new Error('!id')

  const items = [
    { icon: svgLock, title: 'Security', description: 'Newsletter recipient names & emails are encrypted using industry-standard AEAD algorithms' },
    { icon: svgFrequency, title: 'Frequency', description: 'We rarely send out more then one email a month, because we respect you and your inbox' },
  ]

  return <>
    <div id={id} class="form hidden">
      <div class="badge">STAY INFORMED</div>
      <div class="flex">
        <div class="left">
          <div class="title">Flowing Together</div>
          <div class="description">Stay informed about upcoming opportunities, community restoration projects, and success stories from the workbench.</div>
          <div class="items">
            {items.map(item => <>
              <div class="item">
                <div class="icon" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
                <div class="info">
                  <div class="primary">{item.title}</div>
                  <div class="secondary">{item.description}</div>
                </div>
              </div>
            </>)}
          </div>
        </div>

        <div class="right">
          <div class="mask"></div>
          <div class="inputs">
            <div class="title">Join Newsletter</div>
            <form data-directive={onJoinNewsletterSubmit()} class="bg-pattern">
              <div class="two">
                <Field name="firstName" placeholder="First Name" type="text" prefix={id} />
                <Field name="lastName" placeholder="Last Name" type="text" prefix={id} />
              </div>

              <Field name="email" placeholder="Email" type="email" prefix={id} />
              <button class="orange wide" type="submit">Join Newsletter</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}


const ContactUs: FC = () => {
  const id = dsHomeFormIds[3]
  if (!id) throw new Error('!id')

  const items = [
    { icon: svgLock, title: 'Security', description: 'Contact names, emails and messages are encrypted using industry-standard AEAD algorithms' },
    { icon: svgFrequency, title: 'Frequency', description: 'We will receive an email once you fill out the form and get back to you within 24 hours' },
  ]

  return <>
    <div id={id} class="form hidden">
      <div class="badge">UNITED WE STAND</div>
      <div class="flex">
        <div class="left">
          <div class="title">Let's Connect</div>
          <div class="description">We're all ears, and we'd love to hear from you because it takes a village, to raise a Mount Shasta!</div>
          <div class="items">
            {items.map(item => <>
              <div class="item">
                <div class="icon" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
                <div class="info">
                  <div class="primary">{item.title}</div>
                  <div class="secondary">{item.description}</div>
                </div>
              </div>
            </>)}
          </div>
        </div>

        <div class="right">
          <div class="mask"></div>
          <div class="inputs">
            <div class="title">Contact Us</div>
            <form data-directive={onContactUsSubmit()} class="bg-pattern">
              <div class="two">
                <Field name="firstName" placeholder="First Name" type="text" prefix={id} />
                <Field name="lastName" placeholder="Last Name" type="text" prefix={id} />
              </div>

              <Field name="email" placeholder="Email" type="email" prefix={id} />
              <Field name="message" placeholder="Message" type="textarea" prefix={id} />
              <button class="orange wide" type="submit">Contact Us</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
