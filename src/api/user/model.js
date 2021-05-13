import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { env } from '../../config'

const accountStatus = ['active', 'banned']
const roles = ['user', 'seller', 'support', 'admin']
const plans = ['plus', 'pro']

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
  invitedBy: {
    type: String,
    default: 'admin'
  },
  status: {
    type: String,
    enum: accountStatus,
    default: 'active'
  },
  hardwareID: {
    type: String,
    trim: true
  },
  secret: {
    type: String,
    required: true
  },
  subscription: {
    plan: { type: String, enum: plans, required: true },
    expiry: { type: Date, required: true }
  }
}, {
  timestamps: true
})

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
    let fields = ['_id', 'username', 'status', 'subscription']

    if (full) {
      fields = [...fields, 'invitedBy', 'role', 'createdAt']
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
