import { Router } from 'express'
import { login, logout } from './controller'

const router = Router()

router.get('/', login)

router.get('/logout', logout)

export default router
