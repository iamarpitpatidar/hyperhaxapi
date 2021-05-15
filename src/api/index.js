import { Router } from 'express'
import main from './main'
import user from './user'

const router = new Router()

router.use('/', main)
router.use('/users', user)

export default router
