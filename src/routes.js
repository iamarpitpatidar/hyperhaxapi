import { Router } from 'express'
import api from './api'
import webhook from './webhook'

const router = Router()

router.use('/api', api)
router.use('/webhooks', webhook)

export default router
