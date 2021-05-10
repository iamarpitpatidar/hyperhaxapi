import { User } from './index'
import { success } from '../../services/response'

export const create = (req, res, next) => {
  User.create(req.body)
    .then(user => user.view(true))
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'username',
          message: 'username already registered'
        })
      } else {
        next(err)
      }
    })
}
