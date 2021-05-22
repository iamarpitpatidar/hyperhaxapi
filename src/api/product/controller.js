import mongoose from 'mongoose'
import { Product } from './index'
import { sellix } from '../../utils'
import { notFound, success } from '../../services/response'

export const index = (req, res, next) => {
  Product.find()
    .then(product => ({
      rows: product,
      count: product.length
    }))
    .then(success(res))
    .catch(next)
}

export const show = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return notFound(res)(null)
  Product.findById(req.params.id)
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}

export const purge = (req, res, next) => {
  Product.deleteMany({})
    .then(() => sellix.getAllProducts())
    .then(products => {
      products.forEach(async product => {
        await Product.create({
          name: product.title,
          description: product.description,
          image: product.image ? product.image : 'default',
          price: product.price,
          stock: product.stock !== -1 ? product.stock : 99999,
          sellixID: product.uniqid,
          gateways: product.gateways.filter(each => each).length ? product.gateways : ['FREE']
        })
      })
      return { message: 'Purge completed' }
    })
    .then(success(res))
    .catch(next)
}
