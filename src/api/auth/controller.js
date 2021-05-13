import { sign } from '../../services/jwt'
import { success } from '../../services/response'

export const login = ({ user }, res, next) => {
  sign({
    id: user.id,
    secret: user.secret,
    expiry: Date.now() + (1000 * 60 * 60)
  })
    .then((token) => ({ token, user: user.view() }))
    .then(success(res, 201))
    .catch(next)
}

export const logout = (req, res, next) => {
  req.user.secret = Math.random().toString(32).substring(2)

  req.user.save()
  return res.status(200).json({ message: 'ok' })
}
