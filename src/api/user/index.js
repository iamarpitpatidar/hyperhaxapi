import { Router } from 'express'
import { middleware as body } from 'bodymen'
// import { subscription as subscriptionAuth } from '../../services/passport'
import { create } from './controller'
import { schema } from './model'
import { checkSubscriptionCode } from './helpers'
export User, { schema } from './model'

const router = new Router()
const { username, password, inviteCode } = schema.tree

router.route('/')
  .get((req, res) => {
    res.send('Users route')
  })
  .post(
    body({ username, password, inviteCode }),
    checkSubscriptionCode,
    create)

export default router
