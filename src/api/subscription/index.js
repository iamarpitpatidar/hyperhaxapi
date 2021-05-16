import { Router } from 'express'
import { index } from './controller'
import { schema } from './model'
export Subscription, { schema } from './model'

const router = Router()

router.get('/', index)

export default router
