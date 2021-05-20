import request from 'supertest'
import express from 'express'
import routes from './index'
import server from '../../services/express'
import { User } from '../user'
import { verify, signSync } from '../../services/jwt'

const app = server(express(), routes)
let user, session

beforeEach(async () => {
  user = await User.create({ username: 'iamarpit', password: 'password', hardwareID: '123456' })
  session = signSync({
    id: user.id,
    secret: user.secret,
    expiry: Date.now() + (1000 * 60 * 60)
  })
})

test('should return Access Token - (201, user)', async () => {
  const { status, body } = await request(app)
    .post('/')
    .auth('iamarpit', 'password')
    .send({ hardwareID: '123456' })

  expect(status).toBe(201)
  expect(typeof body).toBe('object')
  expect(typeof body.token).toBe('string')
  expect(typeof body.user).toBe('object')
  expect(body.user._id).toBe(user.id)
  expect(await verify(body.token)).toBeTruthy()
})
test('should throw Bad Request - invalid username (400, user)', async () => {
  const { status, body } = await request(app)
    .post('/')
    .auth('i', 'password')
    .send({ hardwareID: '123456' })

  expect(status).toBe(400)
  expect(typeof body).toBe('object')
  expect(body.param).toBe('username')
})
test('should throw Bad Request - invalid password (400, user)', async () => {
  const { status, body } = await request(app)
    .post('/')
    .auth('iamarpit', '123')
    .send({ hardwareID: '123456' })

  expect(status).toBe(400)
  expect(typeof body).toBe('object')
  expect(body.param).toBe('password')
})
test('should throw UnAuthorized - wrong password (401, user)', async () => {
  const { status } = await request(app)
    .post('/')
    .auth('iamarpit', 'passwor')
    .send({ hardwareID: '123456' })

  expect(status).toBe(401)
})
test('should throw UnAuthorized - user does not exist (401, user)', async () => {
  const { status } = await request(app)
    .post('/')
    .auth('iampolite', 'password')
    .send({ hardwareID: '123456' })

  expect(status).toBe(401)
})
test('should throw UnAuthorized - missing hardwareID (401, user)', async () => {
  const { status, body } = await request(app)
    .post('/')
    .auth('iamarpit', 'password')

  expect(status).toBe(400)
  expect(typeof body).toBe('object')
  expect(body.param).toBe('hardwareID')
})
test('should throw UnAuthorized - (401, no Auth)', async () => {
  const { status } = await request(app)
    .post('/')
    .send({ hardwareID: '123456' })

  expect(status).toBe(401)
})

test('should purge Access Token - (200)', async () => {
  const { status, body } = await request(app)
    .delete('/token')
    .send({ access_token: session })

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.message).toBe('access token has been purged')
})
test('should throw Forbidden - missing Access Token (403)', async () => {
  const { status, body } = await request(app)
    .delete('/token')

  expect(status).toBe(403)
  expect(typeof body).toBe('object')
  expect(body.message).toBe('Access Denied')
})
