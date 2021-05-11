import mongoose from 'mongoose'
import { User } from './index'
import { success, notFound, error } from '../../services/response'

export const index = ({ querymen: { query, select, cursor }, user }, res, next) => {
  User.count(query)
    .then(count => User.find(query, select, cursor)
      .then(users => ({
        rows: users.filter(each => {
          if (user.role === 'seller') return (each.invitedBy === user.username) ? each.view(true) : false
          else return each.view(true)
        }),
        count
      }))
    )
    .then(success(res))
    .catch(next)
}
export const show = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return notFound(res)(null)
  User.findById(req.params.id)
    .then(user => {
      if (req.user.role === 'seller') return user.invitedBy === req.user.username ? user.view(true) : null
      else return user ? user.view(true) : null
    })
    .then(notFound(res))
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
