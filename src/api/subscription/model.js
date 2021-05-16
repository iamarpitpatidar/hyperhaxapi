import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const subscriptionSchema = new Schema({
  plan: {
    type: String
  }
})

subscriptionSchema.plugin(mongooseKeywords, { paths: ['username'] })
const model = mongoose.model('User', subscriptionSchema)

export const schema = model.schema
export default model
