import { Router } from 'express'
import { login, logout } from './controller'
import { password, token } from '../../services/passport'

const router = new Router()

router.post('/',
  password,
  login)

router.get('/logout',
  token({ required: true, roles: ['user'] }),
  logout)

export default router
