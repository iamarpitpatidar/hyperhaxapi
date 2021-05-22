import request from 'supertest'
import express from 'express'
import routes from './index'
import server from '../../services/express'
import { User } from '../user'
import { signSync } from '../../services/jwt'

const app = server(express(), routes)
const session = {}

beforeEach(async () => {
  const user = await User.create({ username: 'user', password: 'password', hardwareID: '123456' })
  const seller = await User.create({ username: 'seller', password: 'password', role: 'seller', hardwareID: '123457' })
  const seller2 = await User.create({ username: 'seller2', password: 'password', role: 'seller', hardwareID: '123460' })
  const seller3 = await User.create({ username: 'seller3', password: 'password', role: 'seller', hardwareID: '123461' })
  const support = await User.create({ username: 'support', password: 'password', role: 'support', hardwareID: '123458' })
  const admin = await User.create({ username: 'admin', password: 'password', role: 'admin', hardwareID: '123459' })

  session.user = signSync({ id: user.id, secret: user.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.seller = signSync({ id: seller.id, secret: seller.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.support = signSync({ id: support.id, secret: support.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.admin = signSync({ id: admin.id, secret: admin.secret, expiry: Date.now() + (1000 * 60 * 60) })
})

describe('get sellers', () => {
  it('should return all sellers - (200, admin)', async () => {
    const { status, body } = await request(app)
      .get('/')
      .send({ access_token: session.admin })

    expect(status).toBe(200)
    expect(typeof body).toBe('object')
    expect(Array.isArray(body.rows)).toBeTruthy()
    expect(body.rows.length).toBe(3)
  })
  it('should throw UnAuthorized - (403, seller)', async () => {
    const { status, body } = await request(app)
      .get('/')
      .send({ access_token: session.seller })

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw UnAuthorized - (403, user)', async () => {
    const { status, body } = await request(app)
      .get('/')
      .send({ access_token: session.user })

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
})
