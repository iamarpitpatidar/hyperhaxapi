import passport from 'passport'
import mongoose from 'mongoose'
import { Strategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { error as sendError } from './response'
import { jwtSecret } from '../config'
import User from '../api/user/model'

export const password = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) { sendError(res, 400, 'Username is required'); return }
  if (!req.body.username || req.body.username.length < 3) { sendError(res, 400, 'Invalid Username'); return }
  if (!req.body.password || req.body.password === '') { sendError(res, 400, 'Password is required'); return }
  if (req.body.password.length < 6) { sendError(res, 400, 'Invalid Password'); return }

  passport.authenticate('local', (error, user) => {
    if (error && error.param) {
      return res.status(400).json(error)
    } else if (error === 'AUTH_ERROR') {
      return res.status(401).json({ message: 'Username or Password incorrect' })
    } else if (!user) return res.status(400).end()

    req.logIn(user, { session: false }, (error) => {
      if (error) return res.status(400).end()
      next()
    })
  })(req, res, next)
}

export const token = ({ required, roles = User.roles } = {}) => async (req, res, next) => {
  passport.authenticate('token', { session: false }, (error, user, info) => {
    if (error === 'TOKEN_EXPIRED') { sendError(res, 401, 'Access Token is expired'); return }
    if (error === 'INVALID_TOKEN') { sendError(res, 402, 'Access Token is invalid'); return }
    if (user && required && !~roles.indexOf(user.role)) { sendError(res, 401, 'Access Denied'); return }
    if (error || (required && !user)) return res.status(403).json({ message: 'Access Denied' })

    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)
}

passport.use(new Strategy((username, password, done) => {
  User.findOne({ username }, async (error, user) => {
    if (error) { return done(error) }
    if (!user) { return done('AUTH_ERROR') }

    return user.authenticate(password).then((user) => {
      if (!user) return done('AUTH_ERROR')

      done(null, user)
    }).catch(done)
  })
}))

passport.use('token', new JwtStrategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  ])
}, ({ id, secret, expiry }, next) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return next('INVALID_TOKEN')
  if (Date.now() > expiry) return next('TOKEN_EXPIRED')

  User.findById(id).then(user => {
    if (secret !== user.secret) return next('INVALID_TOKEN')
    next(null, user)
  }).catch(next)
}))
