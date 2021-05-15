import { User } from './index'
import { success, error } from '../../services/response'

export const create = ({ bodymen: { body } }, res, next) => {
  User.create(body).then(user => {
    next()
    return user.view(true)
  })
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) error(res, 409, 'username already registered')
      else error(res, 500)
    })
}
