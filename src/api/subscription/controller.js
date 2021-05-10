import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import { error as sendError } from '../../services/response'
import { Subscription } from './index'

export const validate = ({ bodymen: { body: { inviteCode } } }, res, next) => {
  if (!inviteCode) { sendError(res, 401, 'InviteCode Required'); return }
  if (!uuidValidate(inviteCode) || uuidVersion(inviteCode) !== 5) {
    sendError(res, 422, 'Invalid InviteCode')
    return
  }

  Subscription.findOne({ code: inviteCode, expiry: { $gt: Date.now() } }, (error, code) => {
    if (error) { sendError(res, 500, 'Internal Server Error'); return }

    if (!code) { sendError(res, 422, 'Code is either invalid or expired'); return }
    if (code.used) { sendError(res, 422, 'Code has been already used by someone!'); return }
    next()
  })
}

export const addToRequest = (req, res, next) => {
  Subscription.findOne({ code: req.body.inviteCode }, (error, subscription) => {
    if (error) sendError(res, 500, 'Internal Server Error')

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

export const markAsUsed = ({ bodymen: { body: { inviteCode } } }) => {
  Subscription.findOne({ code: inviteCode }).then(subscription => {
    if (subscription) {
      subscription.used = true
      subscription.save()
    }
    return null
  })
}

// Subscription.create({
//   code: 'c106a26a-21bb-5538-8bf2-57095d1976c1'
// })
