import { Router } from 'express'
export Subscription, { schema } from './model'

const router = new Router()

router.route('/')
  .get((req, res) => {
    res.send('subscription route').end()
  })

export default router
