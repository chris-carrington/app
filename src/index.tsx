// app/src/index.tsx

import { Hono } from 'hono'
import home from './home/home.route'
import tags from '@src/lib/tags.api'
import { renderer } from '@src/renderer'
import people from '@src/lib/people.api'
import profile from '@src/lib/profile.route'
import signInApi from '@src/auth/signIn.api'
import signUpApi from '@src/auth/signUp.api'
import sessionApi from '@src/auth/session.api'
import mastery from '@src/mastery/mastery.route'
import signInRoute from '@src/auth/signIn.route'
import signUpRoute from '@src/auth/signUp.route'
import signOutRoute from '@src/auth/signOut.route'
import contactUs from '@src/contactUs/contactUs.api'
import magicLinkRoute from '@src/auth/magicLink.route'
import objective from '@src/objectives/objective.api'
import objectives from '@src/objectives/objectives.route'
import transparency from '@src/transparency/transparency.route'
import serviceRequest from '@src/serviceRequest/serviceRequest.api'
import joinLeadership from '@src/joinLeadership/joinLeadership.api'
import joinNewsletter from '@src/joinNewsletter/joinNewsletter.api'


const app = new Hono()
  .use(renderer)
  .route('/', home)
  .route('/api/tags', tags)
  .route('/profile', profile)
  .route('/mastery', mastery)
  .route('/api/people', people)
  .route('/sign-in', signInRoute)
  .route('/sign-up', signUpRoute)
  .route('/sign-out', signOutRoute)
  .route('/api/sign-in', signInApi)
  .route('/api/sign-up', signUpApi)
  .route('/objectives', objectives)
  .route('/api/session', sessionApi)
  .route('/api/objective', objective)
  .route('/api/contact-us', contactUs)
  .route('/transparency', transparency)
  .route('/magic-link', magicLinkRoute)
  .route('/api/join-leadership', joinLeadership)
  .route('/api/join-newsletter', joinNewsletter)
  .route('/api/service-request', serviceRequest)

export default app

export type AppType = typeof app
