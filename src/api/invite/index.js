import { Router } from 'express'
import { middleware as query } from 'querymen'
import { index, show, create } from './controller'
import { token } from '../../services/passport'
export Invite, { schema } from './model'

const router = new Router()

router.get('/',
  token({ required: true, roles: ['seller', 'support', 'admin'] }),
  query(),
  index
)

router.get('/:id',
  token({ required: true, roles: ['seller', 'support', 'admin'] }),
  show)

router.post('/create',
  token({ required: true, roles: ['admin'] }),
  create)

export default router
