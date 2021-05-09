import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const plans = ['plus', 'pro']

const subscriptionSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  plan: {
    type: String,
    required: true,
    enum: plans,
    default: 'plus'
  },
  expiry: {
    type: Date,
    required: true,
    default: Date.now() + (24 * 60 * 60 * 1000)
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

subscriptionSchema.statics = {
  plans
}

subscriptionSchema.plugin(mongooseKeywords, { paths: ['code', 'plan'] })
const model = mongoose.model('Subscription', subscriptionSchema)

export const schema = model.schema
export default model
