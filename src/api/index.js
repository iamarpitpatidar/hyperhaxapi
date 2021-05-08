import { Router } from 'express'
import main from './main'
import auth from './auth'
import user from './user'

const router = new Router()

router.use('/', main)
router.use('/auth', auth)
router.use('/users', user)

export default router
