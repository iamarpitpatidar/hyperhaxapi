import { Router } from 'express'
import { index, create } from './controller'

const router = new Router()

router.get('/', index)
router.post('/create', create)

export default router
