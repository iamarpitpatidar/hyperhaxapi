import request from 'supertest'
import express from 'express'
import routes, { User } from './index'
import { Subscription } from '../subscription'

const app = express()
app.use('/', routes)
const inviteCode = 'c106a26a-21bb-5538-8bf2-57095d1976c1'
let user

beforeEach(async () => {
  const subscription = await Subscription.create({ code: inviteCode })
  user = await User.create({
    username: 'iamarpit',
    password: '123456',
    invitedBy: subscription.createdBy,
    subscription: {
      plan: subscription.plan,
      expiry: subscription.expiry
    }
  })
})

test('POST /users 400 - Bad Request', async () => {
  const { status } = await request(app)
    .post('/')
    .send({ email: 'd@d.com', password: '123456' })

  expect(status).toEqual(400)
})
test('POST /users 400 - missing Password', async () => {
  const { status, body } = await request(app)
    .post('/')
    .send({ inviteCode: inviteCode, username: 'iamarpit' })

  console.log(body)
  expect(status).toBe(400)
  // expect(typeof body).toBe('object')
  // expect(body.param).toBe('password')
})
