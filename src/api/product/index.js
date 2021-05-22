import { Router } from 'express'
import { index, show, purge } from './controller'
import { token } from '../../services/passport'
export Product, { schema } from './model'

const router = new Router()

router.route('/')
  .get(index)
  .delete(
    token({ required: true, roles: ['admin'] }),
    purge)

router.get('/:id', show)

export default router
