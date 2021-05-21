import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const inviteSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  role: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    default: 1
  },
  orderID: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  soldTo: {
    type: String,
    enum: ['user', 'seller'],
    default: 'user'
  },
  used: {
    type: Boolean,
    default: false
  }
})

inviteSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['_id', 'role', 'length', 'orderID', 'createdBy']

    if (full) {
      fields = [...fields, 'code', 'soldTo', 'used', 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] })
    return view
  }
}

inviteSchema.plugin(mongooseKeywords, { paths: ['orderID', 'createdBy'] })
const model = mongoose.model('Invite', inviteSchema)

export const schema = model.schema
export default model
