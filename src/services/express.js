import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import passport from 'passport'
import bodyParser from 'body-parser'
import compression from 'compression'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../config'
import routes from '../api'

module.exports = function (app) {
  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
    app.use(helmet())
  }

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(passport.initialize())
  app.set('trust proxy', true)
  app.use('/', routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())
}
