import { Product } from './index'
import { success } from '../../services/response'

export const index = (req, res, next) => {
  Product.find()
    .then(products => products)
    .then(success(res))
    .catch(next)
}

export const create = ({ bodymen: { body } }, res, next) => {

}
