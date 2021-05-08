import { Router } from 'express'
const router = new Router()

router.get('/', (req, res) => {
  res.send('<h1>Users Route</h1>')
})

export default router
