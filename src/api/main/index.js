import { Router } from 'express'
const router = new Router()

router.route('/')
  .get((req, res) => {
    res.status(200).json({
      status: 'ok',
      jussi_tag: Math.random().toString(32).substring(2, 15),
      author: {
        name: 'Arpit Patidar',
        email: 'arpit.prdr@hotmail.com',
        discord: 'arpit#8586'
      }
    })
  })

export default router
