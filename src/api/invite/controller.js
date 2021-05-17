import mongoose from 'mongoose'
import { Invite } from './index'
import { success, notFound } from '../../services/response'

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

export const create = (req, res) => {
  res.send('This route will create a inviteCode, and return the object')
}
