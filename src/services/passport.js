import passport from 'passport'
import { Strategy } from 'passport-local'
import { error as sendError } from './response'
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

export const token = async (req, res, next) => {
  console.log(JSON.stringify(req.headers))
  console.log(req.body)
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

// passport.use()
