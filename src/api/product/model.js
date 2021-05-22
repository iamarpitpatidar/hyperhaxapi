import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import mongooseINT32 from 'mongoose-int32'
const Int32 = mongooseINT32.loadType(mongoose)

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
  },
  stock: {
    type: Number,
    required: true
  },
  sellixID: {
    type: String,
    unique: true,
    index: true,
    required: true
  }
}, { timestamps: true })

productSchema.plugin(mongooseKeywords, { paths: ['sellixID'] })
const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
