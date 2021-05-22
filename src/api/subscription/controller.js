import { notFound, success } from '../../services/response'
import { Subscription } from './index'

export const destroy = ({ params }, res, next) =>
  Subscription.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
