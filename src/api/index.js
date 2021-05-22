import { Router } from 'express'
import main from './main'
import auth from './auth'
// import user from './user'
import invite from './invite'
import seller from './seller'
import product from './product'
import subscription from './subscription'

const router = new Router()

router.use('/', main)
router.use('/auth', auth)
// router.use('/users', user)
router.use('/invites', invite)
router.use('/sellers', seller)
router.use('/products', product)
router.use('/subscriptions', subscription)

export default router
