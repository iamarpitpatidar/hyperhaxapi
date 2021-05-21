import request from 'supertest'
import express from 'express'
import { validate as uuidValidate, v5 as uuid } from 'uuid'
import { User } from '../user'
import routes, { Invite } from './index'
import { signSync } from '../../services/jwt'
import server from '../../services/express'
import { baseNamespace } from '../../config'

const app = server(express(), routes)
let user, seller, support, admin
const session = {}
const invite = {}

beforeEach(async () => {
  user = await User.create({ username: 'user', password: 'password', hardwareID: '123456' })
  seller = await User.create({ username: 'seller', password: 'password', role: 'seller', hardwareID: '123457' })
  support = await User.create({ username: 'support', password: 'password', role: 'support', hardwareID: '123458' })
  admin = await User.create({ username: 'admin', password: 'password', role: 'admin', hardwareID: '123459' })

  // invites
  invite.admin = await Invite.create({
    code: uuid(Math.random().toString(32).substring(2), baseNamespace),
    role: 'rust',
    length: 1,
    orderID: 'ID123450'
  })
  invite.admin2 = await Invite.create({
    code: uuid(Math.random().toString(32).substring(2), baseNamespace),
    role: 'rust',
    length: 1,
    orderID: 'ID123451'
  })
  invite.seller = await Invite.create({
    code: uuid(Math.random().toString(32).substring(2), baseNamespace),
    role: 'rust',
    length: 1,
    createdBy: seller.username,
    orderID: 'ID123452'
  })
  invite.seller2 = await Invite.create({
    code: uuid(Math.random().toString(32).substring(2), baseNamespace),
    role: 'rust',
    length: 1,
    createdBy: seller.username,
    orderID: 'ID123453'
  })

  // sessions
  session.user = signSync({ id: user.id, secret: user.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.seller = signSync({ id: seller.id, secret: seller.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.support = signSync({ id: support.id, secret: support.secret, expiry: Date.now() + (1000 * 60 * 60) })
  session.admin = signSync({ id: admin.id, secret: admin.secret, expiry: Date.now() + (1000 * 60 * 60) })
})

describe('Get Invites by ID', () => {
  it('should return Invite code - (200, admin)', async () => {
    const { status, body } = await request(app)
      .get(`/${invite.admin.id}`)
      .send({ access_token: session.admin })

    expect(status).toEqual(200)
    expect(typeof body).toEqual('object')
    expect(body.createdBy).toEqual('admin')
    expect(body._id).toEqual(invite.admin.id)
    expect(body.code).toEqual(invite.admin.code)
  })
  it('should return Invite code - (200, support)', async () => {
    const { status, body } = await request(app)
      .get(`/${invite.admin.id}`)
      .send({ access_token: session.support })

    expect(status).toEqual(200)
    expect(typeof body).toEqual('object')
    expect(body.createdBy).toEqual('admin')
    expect(body._id).toEqual(invite.admin.id)
    expect(body.code).toEqual(invite.admin.code)
  })
  it('should return Invite code - (200, seller)', async () => {
    const { status, body } = await request(app)
      .get(`/${invite.seller.id}`)
      .send({ access_token: session.seller })

    expect(status).toEqual(200)
    expect(typeof body).toEqual('object')
    expect(body.createdBy).toEqual('seller')
    expect(body._id).toEqual(invite.seller.id)
    expect(body.code).toEqual(invite.seller.code)
  })
  it('should throw Forbidden - (403, user)', async () => {
    const { status, body } = await request(app)
      .get('/invalid')
      .send({ access_token: session.user })

    expect(status).toEqual(403)
    expect(typeof body).toEqual('object')
    expect(body.message).toEqual('Access Denied')
  })
  it('should throw Forbidden - (403, no Auth)', async () => {
    const { status, body } = await request(app)
      .get('/invalid')

    expect(status).toEqual(403)
    expect(typeof body).toEqual('object')
    expect(body.message).toEqual('Access Denied')
  })
  it('should throw not Found - created by someone else (404, seller)', async () => {
    const { status } = await request(app)
      .get(`/${invite.admin.id}`)
      .send({ access_token: session.seller })

    expect(status).toEqual(404)
  })
  it('should throw not Found - invalid Id (404, seller)', async () => {
    const { status } = await request(app)
      .get('/invalid')
      .send({ access_token: session.seller })

    expect(status).toEqual(404)
  })
  it('should throw not Found - invalid Id (404, support)', async () => {
    const { status } = await request(app)
      .get('/invalid')
      .send({ access_token: session.support })

    expect(status).toEqual(404)
  })
  it('should throw not Found - invalid Id (404, admin)', async () => {
    const { status } = await request(app)
      .get('/invalid')
      .send({ access_token: session.admin })

    expect(status).toEqual(404)
  })
})

describe('Create Invite', () => {
  it('should create invite code - (201, admin)', async () => {
    const { status, body } = await request(app)
      .post('/create')
      .send({
        role: 'rust',
        length: 1,
        orderID: 'order12347',
        access_token: session.admin
      })

    expect(status).toEqual(201)
    expect(typeof body).toBe('object')
    expect(body.createdBy).toEqual('admin')
    expect(uuidValidate(body.code)).toBeTruthy()
  })
  it('should throw Bad Request - params missing (400)', async () => {
    const { status, body } = await request(app)
      .post('/create')

    expect(status).toEqual(400)
    expect(typeof body).toBe('object')
    expect(body.param).toBe('role')
  })
  it('should throw Forbidden - (403, no Auth)', async () => {
    const { status, body } = await request(app)
      .post('/create')
      .send({
        role: 'rust',
        length: 1,
        orderID: 'order12345'
      })

    expect(status).toEqual(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw Forbidden - (403, user)', async () => {
    const { status, body } = await request(app)
      .post('/create')
      .send({
        role: 'rust',
        length: 1,
        orderID: 'order12345',
        access_token: session.user
      })

    expect(status).toEqual(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw Forbidden - (403, seller)', async () => {
    const { status, body } = await request(app)
      .post('/create')
      .send({
        role: 'rust',
        length: 1,
        orderID: 'order12345',
        access_token: session.seller
      })

    expect(status).toEqual(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw Forbidden - (403, support)', async () => {
    const { status, body } = await request(app)
      .post('/create')
      .send({
        role: 'rust',
        length: 1,
        orderID: 'order12345',
        access_token: session.support
      })

    expect(status).toEqual(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw conflict - (409, admin)', async () => {
    const { status, body } = await request(app)
      .post('/create')
      .send({
        role: 'rust',
        length: 1,
        orderID: 'ID123450',
        access_token: session.admin
      })

    expect(status).toBe(409)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Invite already exist')
  })
})
