import { Router } from 'express'
import user from './user'
import auth from './auth'

const router = new Router()

router.use('/users', user)
router.use('/auth', auth)

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    jussi_tag: Math.random().toString(32).substring(2, 15),
    author: {
      name: 'Arpit Patidar',
      email: '<arpit.prdr@hotmail.com>',
      discord: 'arpit#8586'
    }
  }).end()
})

export default router
