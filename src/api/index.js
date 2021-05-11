import { Router } from 'express'
import main from './main'
import auth from './auth'
import user from './user'
import product from './product'
import subscription from './subscription'

const router = new Router()

router.use('/', main)
router.use('/auth', auth)
router.use('/users', user)
router.use('/products', product)
router.use('/subscription', subscription)

export default router
