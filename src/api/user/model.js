// import crypto from 'crypto'
import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { env } from '../../config'

const roles = ['user', 'seller', 'admin', 'master']

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: roles,
    default: 'user'
  },
  inviteCode: {
    type: String,
    required: true,
    trim: true
  },
  subscription: {
    type: Object,
    required: true
  },
  picture: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// userSchema.path('username').set(function (username) {
//   if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
//     const hash = crypto.createHash('md5').update(email).digest('hex')
//     this.picture = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`
//   }
//
//   if (!this.name) {
//     this.name = email.replace(/^(.+)@.+$/, '$1')
//   }
//
//   return email
// })

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  /* istanbul ignore next */
  const rounds = env === 'test' ? 1 : 9

  bcrypt.hash(this.password, rounds).then((hash) => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['id', 'username', 'picture']

    if (full) {
      fields = [...fields, 'createdAt', 'role', 'subscription']
    }

    fields.forEach((field) => { view[field] = this[field] })
    return view
  },

  authenticate (password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
  }
}

userSchema.statics = {
  roles
}

userSchema.plugin(mongooseKeywords, { paths: ['username'] })

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
