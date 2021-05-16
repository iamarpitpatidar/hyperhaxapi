import { Router } from 'express'
import { index, create } from './controller'
export Invite, { schema } from './model'

const router = new Router()

router.get('/', index)
router.post('/create', create)

export default router
