import { Product } from './index'
import { success } from '../../services/response'

export const index = (req, res, next) => {
  Product.find()
    .then(product => ({
      rows: product,
      count: product.length
    }))
    .then(success(res))
    .catch(next)
}
