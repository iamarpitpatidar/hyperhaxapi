import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const subscriptionSchema = new Schema({
  plan: {
    type: String
  }
})

subscriptionSchema.plugin(mongooseKeywords, { paths: ['plan'] })
const model = mongoose.model('Subscription', subscriptionSchema)

export const schema = model.schema
export default model
