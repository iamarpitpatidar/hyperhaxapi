import mongoose from 'mongoose'
import { v5 as uuid } from 'uuid'
import { Invite } from './index'
import { baseNamespace } from '../../config'
import { success, error, notFound } from '../../services/response'

export const index = ({ querymen: { query, select, cursor }, user }, res, next) => {
  Invite.count(query)
    .then(count => Invite.find(query, select, cursor)
      .then(invites => ({
        rows: invites.filter(each => {
          if (user.role === 'seller') return (each.createdBy === user.username) ? each.view(true) : false
          else return each.view()
        }),
        count
      }))
    )
    .then(success(res))
    .catch(next)
}
export const show = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return notFound(res)(null)
  Invite.findById(req.params.id)
    .then(invite => {
      if (req.user.role === 'seller') return invite.createdBy === req.user.username ? invite.view(true) : null
      else return invite ? invite.view(true) : null
    })
    .then(notFound(res))
    .then(success(res))
    .catch(next)
}
export const create = ({ bodymen: { body } }, res) => {
  Invite.create({
    code: uuid(Math.random().toString(32).substring(2), baseNamespace),
    role: body.role,
    length: body.length,
    orderID: body.orderID
  })
    .then(invite => invite.view(true))
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) error(res, 'invite already exist. Please try again', 409)
      else error(res, 500)
    })
}
