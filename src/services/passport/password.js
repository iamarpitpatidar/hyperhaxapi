import { BasicStrategy } from 'passport-http'
import { Schema } from 'bodymen'
import { User, schema } from '../../api/user'

export default new BasicStrategy((username, password, done) => {
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
})
