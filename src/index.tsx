// app/src/index.tsx

import { Hono } from 'hono'
import home from './home/home.route'
import { renderer } from '@src/renderer'
import signInApi from '@src/auth/signIn.api'
import signUpApi from '@src/auth/signUp.api'
import mastery from '@src/mastery/mastery.route'
import signInRoute from '@src/auth/signIn.route'
import signUpRoute from '@src/auth/signUp.route'
import objectives from '@src/lib/objectives.route'
import contactUs from '@src/contactUs/contactUs.api'
import transparency from '@src/transparency/transparency.route'
import serviceRequest from '@src/serviceRequest/serviceRequest.api'
import joinLeadership from '@src/joinLeadership/joinLeadership.api'
import joinNewsletter from '@src/joinNewsletter/joinNewsletter.api'


const app = new Hono()

app.use(renderer)

app.route('/', home)
app.route('/mastery', mastery)
app.route('/sign-in', signInRoute)
app.route('/sign-up', signUpRoute)
app.route('/api/sign-in', signInApi)
app.route('/api/sign-up', signUpApi)
app.route('/objectives', objectives)
app.route('/api/contact-us', contactUs)
app.route('/transparency', transparency)
app.route('/api/join-leadership', joinLeadership)
app.route('/api/join-newsletter', joinNewsletter)
app.route('/api/service-request', serviceRequest)

export default app
