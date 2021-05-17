import passport from 'passport'
import { Schema } from 'bodymen'
import { BasicStrategy } from 'passport-http'
import User, { schema } from '../api/user/model'

export const password = (req, res, next) => {
  passport.authenticate('password', { session: false }, (err, user) => {
    if (err && err.param) return res.status(400).json(err)
    else if (err || !user) return res.status(401).end()

    if (user.status === 'banned') return res.status(403).json({ message: 'User is banned' })
    if (user.hardwareID !== null) {
      if (user.hardwareID === req.body.hardwareID) {
        req.logIn(user, { session: false }, (err) => {
          if (err) return res.status(401).end()
          next()
        })
      } else return res.status(400).json({ message: 'Your hardwareID does not match the one in server' })
    } else Object.assign(user, { hardwareID: req.body.hardwareID }).save()
  })(req, res, next)
}

passport.use('password', new BasicStrategy((username, password, done) => {
  const userSchema = new Schema({ username: schema.tree.username, password: schema.tree.password })
  userSchema.validate({ username, password }, (err) => {
    if (err) done(err)
  })

  User.findOne({ username }).then((user) => {
    if (!user) {
      done(true)
      return null
    }
    return user.authenticate(password, user.password).then((user) => {
      done(null, user)
      return null
    }).catch(done)
  })
}))
