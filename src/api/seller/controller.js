import { User } from '../user/index'
import { success } from '../../services/response'

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  query.role = 'seller'
  User.find(query, select, cursor)
    .then(users => ({
      rows: users.map(each => each.view(true)),
      count: users.length
    }))
    .then(success(res))
    .catch(next)
}
