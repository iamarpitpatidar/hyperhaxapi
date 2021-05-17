import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { index, show, create } from './controller'
import { token } from '../../services/passport'
import { schema } from './model'
export Invite, { schema } from './model'

const router = new Router()
const { role, length, orderID } = schema.tree

router.get('/',
  token({ required: true, roles: ['seller', 'support', 'admin'] }),
  query(),
  index
)

router.get('/:id',
  token({ required: true, roles: ['seller', 'support', 'admin'] }),
  show)

router.post('/create',
  body({ role, length, orderID }),
  token({ required: true, roles: ['admin'] }),
  create)

export default router
