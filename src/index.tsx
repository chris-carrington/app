// app/src/index.tsx

import { Hono } from 'hono'
import { renderer } from './renderer'
import home from './home/home.route'
import signIn from './lib/signIn.route'
import transparency from './lib/transparency.route'
import objectives from './lib/objectives.route'

const app = new Hono()
app.use(renderer)

app.route('/', home)
app.route('/sign-in', signIn)
app.route('/sign-in', signIn)
app.route('/transparency', transparency)
app.route('/objectives', objectives)

export default app
