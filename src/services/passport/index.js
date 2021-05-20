import passport from 'passport'
import passwordStrategy from './password'
import tokenStrategy from './token'
import User from '../../api/user/model'
import { error as sendError } from '../response'

export const password = (req, res, next) =>
  passport.authenticate('password', { session: false }, (err, user) => {
    if (err && err.param) return res.status(400).json(err)
    else if (err || !user) return res.status(401).end()

    if (user.status === 'banned') return res.status(403).json({ message: 'User is banned' })
    if (user.hardwareID !== null) {
      if (user.hardwareID === req.body.hardwareID) {
        req.logIn(user, { session: false }, (err) => {
          if (err) return res.status(500).end()
          next()
        })
      } else return res.status(400).json({ message: 'Your hardwareID does not match the one in server' })
    } else Object.assign(user, { hardwareID: req.body.hardwareID }).save()
  })(req, res, next)

export const token = ({ required, roles = User.roles } = {}) => (req, res, next) =>
  passport.authenticate('token', { session: false }, (error, user) => {
    if (error === 'TOKEN_EXPIRED') { sendError(res, 'Access Token is expired', 401); return }
    if (error === 'INVALID_TOKEN') { sendError(res, 'Access Token is invalid', 402); return }
    if (user && required && !~roles.indexOf(user.role)) { sendError(res, 'Access Denied', 401); return }
    if (error || (required && !user)) return res.status(403).json({ message: 'Access Denied' })

    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)

passport.use('password', passwordStrategy)
passport.use('token', tokenStrategy)
