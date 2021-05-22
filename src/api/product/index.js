import { Router } from 'express'
import { index } from './controller'
export Product, { schema } from './model'

const router = new Router()

router.route('/')
  .get(index)

export default router
