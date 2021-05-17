import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { login, logout } from './controller'
import { password as passwordAuth } from '../../services/passport'

const router = Router()

router.post('/',
  body({ hardwareID: { type: String, required: true } }),
  passwordAuth,
  login)

router.get('/logout', logout)

export default router
