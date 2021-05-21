import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send('This is a webhook')
})

export default router
