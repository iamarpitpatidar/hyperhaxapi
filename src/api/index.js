import { Router } from 'express'

const router = new Router()

router.get('/', (req, res) => {
  res.header('Content-type', 'text/html')
  return res.end('<h1>Hello, Secure World!</h1>')
})

export default router
