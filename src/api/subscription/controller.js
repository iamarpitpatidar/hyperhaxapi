import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import { success as sendSuccess, error as sendError } from '../../services/response'
import { Subscription } from './index'

export const validate = ({ bodymen: { body: { inviteCode } } }, res, next) => {
  if (!uuidValidate(inviteCode) || uuidVersion(inviteCode) !== 5) {
    sendError(res, { statusCode: 422, message: 'Invalid InviteCode' })
    return
  }

  Subscription.findOne({ code: inviteCode, expiry: { $gt: Date.now() } }, (error, code) => {
    if (error) sendError(res, { statusCode: 500, message: 'Internal Server Error' })
    if (!code) sendError(res, { statusCode: 422, message: 'Code is either invalid or expired' })
    if (code.used) sendError(res, { statusCode: 422, message: 'Code has been already used by someone!' })
    next()
  })
}

export const addToRequest = (req, res, next) => {
  Subscription.findOne({ code: req.body.inviteCode }, (error, subscription) => {
    if (error) sendError(res, { statusCode: 500, message: 'Internal Server Error' })

    req.body = {
      username: req.body.username,
      password: req.body.password,
      invitedBy: subscription.createdBy,
      subscription: {
        plan: subscription.plan,
        expiry: subscription.expiry
      }
    }
    next()
  })
}

// Subscription.create({
//   code: 'c106a26a-21bb-5538-8bf2-57095d1976c1'
// })
