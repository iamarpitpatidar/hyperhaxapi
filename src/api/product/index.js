import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { index } from './controller'
import { token } from '../../services/passport'
import { schema } from './model'
export User, { schema } from './model'

const router = new Router()
const { name, description, image, price } = schema.tree

router.route('/')
  .get(index)
  .post(
    body({ name, description, image, price }),
    token)

export default router
