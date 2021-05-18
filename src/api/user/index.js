import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { create } from './controller'
import { schema } from './model'
export User, { schema } from './model'

const router = Router()
const { username, password } = schema.tree

router.post('/create',
  body({
    username,
    password,
    activationKey: { type: String, required: true }
  }),
  create)

export default router
