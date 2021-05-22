import { Product } from './index'
import { success } from '../../services/response'
import { sellix } from '../../utils'

export const index = (req, res, next) => {
  Product.find()
    .then(product => ({
      rows: product,
      count: product.length
    }))
    .then(success(res))
    .catch(next)
}

export const purge = (req, res, next) => {
  Product.deleteMany({})
    .then(() => sellix.getAllProducts())
    .then(products => {
      products.forEach(async product => {
        console.log(product)
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
