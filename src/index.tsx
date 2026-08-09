// app/src/index.tsx

import { Hono } from 'hono'
import home from './home/home.route'
import { renderer } from '@src/renderer'
import signIn from '@src/lib/signIn.route'
import objectives from '@src/lib/objectives.route'
import contactUs from '@src/contactUs/contactUs.api'
import transparency from '@src/lib/transparency.route'
import serviceRequest from '@src/serviceRequest/serviceRequest.api'
import joinLeadership from '@src/joinLeadership/joinLeadership.api'
import joinNewsletter from '@src/joinNewsletter/joinNewsletter.api'


const app = new Hono()

app.use(renderer)

app.route('/', home)
app.route('/sign-in', signIn)
app.route('/objectives', objectives)
app.route('/api/contact-us', contactUs)
app.route('/transparency', transparency)
app.route('/api/join-leadership', joinLeadership)
app.route('/api/join-newsletter', joinNewsletter)
app.route('/api/service-request', serviceRequest)

export default app
