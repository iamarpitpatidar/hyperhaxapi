import { User } from '../user/index'
import { success } from '../../services/response'

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  User.count(query)
    .then(count => User.find(query, select, cursor)
      .then(users => ({
        rows: users.map(each => (each.role === 'seller') ? each.view(true) : false).filter(v => !!v),
        count
      }))
    )
    .then(success(res))
    .catch(next)
}
