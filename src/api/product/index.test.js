import request from 'supertest'
import express from 'express'
import routes, { Product } from './index'
import server from '../../services/express'
import { User } from '../user'
import { signSync } from '../../services/jwt'

const app = server(express(), routes)
const products = []
const session = {}

beforeEach(async () => {
  const user = await User.create({ username: 'user', password: 'password', hardwareID: '123456' })
  const seller = await User.create({ username: 'seller', password: 'password', role: 'seller', hardwareID: '123457' })
  const support = await User.create({ username: 'support', password: 'password', role: 'support', hardwareID: '123458' })
  const admin = await User.create({ username: 'admin', password: 'password', role: 'admin', hardwareID: '123459' })

  session.user = signSync({ id: user.id, secret: user.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.seller = signSync({ id: seller.id, secret: seller.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.support = signSync({ id: support.id, secret: support.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.admin = signSync({ id: admin.id, secret: admin.secret, expiry: Date.now() + (1000 * 60 * 60) })

  for (let num = 1; num < 5; num++) {
    const product = await Product.create({
      name: `Product${num}`,
      description: `description${num}`,
      image: `image${num}`,
      price: num - Math.random(),
      stock: 99999,
      sellixID: Math.random().toString(32).substring(2)
    })
    products.push(product)
  }
  console.log(products[0]._id)
})

test('should return Array of all products - (200, no Auth)', async () => {
  const { status, body } = await request(app)
    .get('/')

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.rows.length).toBe(4)
})
test('should throw Not Found - (404, no Auth)', async () => {
  const { status } = await request(app)
    .get('/invalid')

  expect(status).toEqual(404)
})

describe('Purge cached products', () => {
  it('should purge all products and add new ones - (200, no Auth)', async () => {
    const { status, body } = await request(app)
      .delete('/')
      .send({ access_token: session.admin })

    expect(status).toBe(200)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Purge completed')
  })
  it('should throw UnAuthorized - (403, support)', async () => {
    const { status, body } = await request(app)
      .delete('/')
      .send({ access_token: session.support })

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw UnAuthorized - (403, seller)', async () => {
    const { status, body } = await request(app)
      .delete('/')
      .send({ access_token: session.seller })

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw UnAuthorized - (403, user)', async () => {
    const { status, body } = await request(app)
      .delete('/')
      .send({ access_token: session.user })

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
})
