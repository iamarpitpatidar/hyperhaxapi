import { Invite } from './index'
import { success } from '../../services/response'

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

export const create = (req, res, next) => {
  res.send('This route will create a inviteCode, and return the object')
}
