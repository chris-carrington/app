// app/src/index.tsx

import { Hono } from 'hono'
import { renderer } from './renderer'
import home from './home/home.route'
import about from './lib/about.route'

const app = new Hono()
app.use(renderer)

app.route('/', home)
app.route('/about', about)

export default app
