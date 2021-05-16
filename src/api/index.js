import { Router } from 'express'
import main from './main'
import user from './user'
import subscription from './subscription'

const router = new Router()

router.use('/', main)
router.use('/users', user)
router.use('/subscriptions', subscription)

export default router
