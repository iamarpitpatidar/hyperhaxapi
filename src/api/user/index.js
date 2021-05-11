import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { schema } from './model'
import { show, create } from './controller'
import { validate, addToRequest, markAsUsed } from '../subscription/controller'
import { token } from '../../services/passport'
export User, { schema } from './model'

const router = new Router()
const { username, password, inviteCode } = schema.tree

router.route('/')
  .get((req, res) => {
    res.send('Users route')
  })
  .post(body({ username, password, inviteCode }),
    validate,
    addToRequest,
    create,
    markAsUsed)

router.route('/:id')
  .get(token({ required: true, roles: ['admin'] }),
    show)

export default router
