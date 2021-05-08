import { Router } from 'express'
const router = new Router()

router.route('/')
  .get((req, res) => {
    res.json({
      status: 'ok',
      jussi_tag: Math.random().toString(32).substring(2, 15),
      author: {
        name: 'Arpit Patidar',
        email: 'arpit.prdr@hotmail.com',
        discord: 'arpit#8586'
      }
    }).end()
  })
  .post((req, res) => {
    res.status(405).end()
  })

export default router
