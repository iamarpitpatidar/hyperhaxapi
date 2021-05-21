import mongoose from 'mongoose'
import { v5 as uuid } from 'uuid'
import { Invite } from './index'
import { baseNamespace } from '../../config'
import { success, error, notFound } from '../../services/response'

export const index = ({ querymen: { query, select, cursor }, user }, res, next) => {
  if (user.role === 'seller') query.createdBy = user.username
  Invite.find(query, select, cursor)
    .then(invites => ({
      rows: invites.map(each => user.role === 'seller' ? each.view(true) : each.view()),
      count: invites.length
    }))
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
    code: uuid(body.orderID + Date.now(), baseNamespace),
    role: body.role,
    length: body.length,
    orderID: body.orderID
  })
    .then(invite => invite.view(true))
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) error(res, '409', 'Invite already exist')
      else error(res, 500)
    })
}
