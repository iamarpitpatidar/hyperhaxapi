import mongoose from 'mongoose'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret } from '../../config'
import { User } from '../../api/user/'

export default new JwtStrategy({
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
})
