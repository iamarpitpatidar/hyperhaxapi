import { Router } from 'express'
import { destroy } from './controller'
import { token } from '../../services/passport'
export Subscription, { schema } from './model'

const router = new Router()

router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
