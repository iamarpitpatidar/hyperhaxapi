import { Product } from './index'
import { notFound, success } from '../../services/response'
import mongoose from 'mongoose'

export const index = (req, res, next) => {
  Product.find()
    .then(products => products)
    .then(success(res))
    .catch(next)
}
export const create = ({ bodymen: { body } }, res, next) => {
  Product.create(body)
    .then(product => product)
    .then(success(res, 201))
}
export const show = ({ params }, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(params.id)) return notFound(res)(null)
  Product.findById(params.id)
    .then(notFound(res))
    .then(product => product)
    .then(success(res))
    .catch(next)
}
