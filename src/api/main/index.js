import { Router } from 'express'
import { success as sendSuccess, error as sendError } from '../../services/response'
const router = new Router()

router.route('/')
  .get((req, res) => {
    sendSuccess(res, {
      status: 'ok',
      jussi_tag: Math.random().toString(32).substring(2, 15),
      author: {
        name: 'Arpit Patidar',
        email: 'arpit.prdr@hotmail.com',
        discord: 'arpit#8586'
      }
    })
  })
  .post((req, res) => {
    sendError(res, {
      statusCode: 405,
      message: 'Method not allowed'
    })
  })

export default router
