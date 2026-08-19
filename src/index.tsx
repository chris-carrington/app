// app/src/index.tsx

import { Hono } from 'hono'
import home from './home/home.route'
import { renderer } from '@src/renderer'
import profile from '@src/lib/profile.route'
import signInApi from '@src/auth/signIn.api'
import signUpApi from '@src/auth/signUp.api'
import sessionApi from '@src/auth/session.api'
import mastery from '@src/mastery/mastery.route'
import signInRoute from '@src/auth/signIn.route'
import signUpRoute from '@src/auth/signUp.route'
import objectives from '@src/lib/objectives.route'
import contactUs from '@src/contactUs/contactUs.api'
import magicLinkRoute from '@src/auth/magicLink.route'
import transparency from '@src/transparency/transparency.route'
import serviceRequest from '@src/serviceRequest/serviceRequest.api'
import joinLeadership from '@src/joinLeadership/joinLeadership.api'
import joinNewsletter from '@src/joinNewsletter/joinNewsletter.api'


const app = new Hono()
  .use(renderer)
  .route('/', home)
  .route('/profile', profile)
  .route('/mastery', mastery)
  .route('/sign-in', signInRoute)
  .route('/sign-up', signUpRoute)
  .route('/api/sign-in', signInApi)
  .route('/api/sign-up', signUpApi)
  .route('/objectives', objectives)
  .route('/api/session', sessionApi)
  .route('/api/contact-us', contactUs)
  .route('/transparency', transparency)
  .route('/magic-link', magicLinkRoute)
  .route('/api/join-leadership', joinLeadership)
  .route('/api/join-newsletter', joinNewsletter)
  .route('/api/service-request', serviceRequest)

export default app

export type AppType = typeof app
