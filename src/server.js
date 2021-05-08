import express from 'express'
import { env, port } from './config'
import services from './services'
import logger from './services/logger'

(async function () {
  const app = express()

  // Loading all the required services
  await services(app)

  app.listen(port, error => {
    if (error) {
      logger.error(error)
      // killing all further process
      process.exit(1)
    }
    logger.info('Server listening on http://localhost:%d, in %s mode', port, env)
  })
})()
