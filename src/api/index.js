import { Router } from 'express'
import main from './main'

const router = new Router()

router.use('/', main)

export default router
