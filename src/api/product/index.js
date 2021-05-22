import { Router } from 'express'

const router = new Router()

router.route('/')
  .get((req, res, next) => {
    res.send('This is product route')
  })

export default router
