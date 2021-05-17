import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { login, logout } from './controller'
import { password as passwordAuth, token } from '../../services/passport'

const router = Router()

router.post('/',
  body({ hardwareID: { type: String, required: true } }),
  passwordAuth,
  login)

router.delete('/token',
  token({ required: true, roles: ['user'] }),
  logout)

export default router
