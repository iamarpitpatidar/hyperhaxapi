import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import { success as sendSuccess, error as sendError } from '../../services/response'
import { Subscription } from './index'

export const validate = ({ bodymen: { body: { inviteCode } } }, res, next) => {
  if (!uuidValidate(inviteCode) || uuidVersion(inviteCode) !== 5) sendError(res, { statusCode: 422, message: 'Invalid InviteCode' })
  console.log(Subscription.find({ code: inviteCode }))
  // next()
}
//
// Subscription.create({
//   code: 'estrdy'
// })
