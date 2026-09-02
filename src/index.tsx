// app/src/index.tsx

import { Hono } from 'hono'
import home from './home/home.route'
import tags from '@src/api/tags.api'
import people from '@src/api/people.api'
import { renderer } from '@src/renderer'
import signInApi from '@src/api/signIn.api'
import signUpApi from '@src/api/signUp.api'
import profile from '@src/lib/profile.route'
import sessionApi from '@src/api/session.api'
import contactUs from '@src/api/contactUs.api'
import objective from '@src/api/objective.api'
import mastery from '@src/mastery/mastery.route'
import signInRoute from '@src/auth/signIn.route'
import signUpRoute from '@src/auth/signUp.route'
import signOutRoute from '@src/auth/signOut.route'
import magicLinkRoute from '@src/auth/magicLink.route'
import serviceRequest from '@src/api/serviceRequest.api'
import joinLeadership from '@src/api/joinLeadership.api'
import joinNewsletter from '@src/api/joinNewsletter.api'
import objectives from '@src/objectives/objectives.route'
import transparency from '@src/transparency/transparency.route'


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
