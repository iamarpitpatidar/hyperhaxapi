import passport from 'passport'
import { Schema } from 'bodymen'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret } from '../config'
import User, { schema } from '../api/user/model'

export const subscription = ({ required } = {}) => (req, res, next) =>
  passport.authenticate('subscription', { session: false }, (err, user, info) => {
    if (err || (required && !user) || (required)) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)

passport.use('subscription', new JwtStrategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('subscription_code'),
    ExtractJwt.fromBodyField('subscription_code')
  ])
}, ({ id }, done) => {
  // User.findById(id).then((user) => {
  //   done(null, user)
  //   return null
  // }).catch(done)
}))
