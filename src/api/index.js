import { Router } from 'express'
import main from './main'
import user from './user'
import invite from './invite'
import subscription from './subscription'

const router = new Router()

router.use('/', main)
router.use('/users', user)
router.use('/invites', invite)
router.use('/subscriptions', subscription)

export default router
