import mongoose from 'mongoose'
import { User } from './index'
import { success, notFound, error } from '../../services/response'

export const show = ({ params }, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(params.id)) return notFound(res)(null)
  User.findById(params.id)
    .then(notFound(res))
    .then(user => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)
}
export const create = (req, res, next) => {
  User.create(req.body)
    .then(user => {
      next()
      return user.view(true)
    })
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) error(res, 409, 'username already registered')
      else error(res, 500)
    })
}
