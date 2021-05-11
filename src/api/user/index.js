import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { index, show, create } from './controller'
import { token } from '../../services/passport'
import { validate, addToRequest, markAsUsed } from '../subscription/controller'
import { schema } from './model'
export User, { schema } from './model'

const router = new Router()
const { username, password, inviteCode } = schema.tree

router.route('/')
  .get(token({ required: true, roles: ['seller', 'admin'] }),
    query(),
    index)
  .post(body({ username, password, inviteCode }),
    validate,
    addToRequest,
    create,
    markAsUsed)

router.route('/:id')
  .get(token({ required: true, roles: ['seller', 'admin'] }),
    show)

export default router
