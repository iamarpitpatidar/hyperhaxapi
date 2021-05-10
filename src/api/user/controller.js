import { User } from './index'
import { success as sendSuccess, error as sendError } from '../../services/response'

export const create = (req, res, next) => {
  User.create(req.body)
    .then(user => {
      sendSuccess(res, user.view(true))
    })
}
