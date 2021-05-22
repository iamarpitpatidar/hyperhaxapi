import mongoose, { Schema } from 'mongoose'

const subscriptionSchema = new Schema({
  plan: {
    type: String,
    required: true,
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
  }
}, {
  timestamps: true
})

const model = mongoose.model('Subscription', subscriptionSchema)

export const schema = model.schema
export default model
