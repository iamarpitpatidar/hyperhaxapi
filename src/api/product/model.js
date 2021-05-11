import mongoose, { Schema } from 'mongoose'
import Int32 from 'mongoose-int32'

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Int32,
    required: true
  }
}, { timestamps: true })

const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
