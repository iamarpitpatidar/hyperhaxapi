import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { index, create, show } from './controller'
import { token } from '../../services/passport'
import { schema } from './model'
export Product, { schema } from './model'

const router = new Router()
const { name, description, image, price } = schema.tree

router.route('/')
  .get(index)
  .post(token({ required: true, roles: ['admin'] }),
    body({ name, description, image, price }),
    create)

router.get('/:id', show)

export default router
