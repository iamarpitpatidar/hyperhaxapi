import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { login, purge } from './controller'
import { password, token } from '../../services/passport'

const router = Router()

router.post('/',
  body({ hardwareID: { type: String, required: true } }),
  password,
  login)

router.delete('/token',
  token({ required: true, roles: ['user'] }),
  purge)

export default router
