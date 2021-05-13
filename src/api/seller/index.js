import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { index } from './controller'

const router = Router()

router.route('/')
  .get(token({ required: true, roles: ['support', 'admin'] }),
    query(),
    index)

export default router
