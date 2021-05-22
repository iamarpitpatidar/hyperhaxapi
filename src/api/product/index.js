import { Router } from 'express'
import { index, purge } from './controller'
import { token } from '../../services/passport'
export Product, { schema } from './model'

const router = new Router()

router.route('/')
  .get(index)
  .delete(
    token({ required: true, roles: ['admin'] }),
    purge)

export default router
