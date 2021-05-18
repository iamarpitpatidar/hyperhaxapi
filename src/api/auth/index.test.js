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

test('POST /auth 201', async () => {
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
test('POST /auth 400 - invalid username', async () => {
  const { status, body } = await request(app)
    .post('/')
    .auth('i', 'password')
    .send({ hardwareID: '123456' })

  expect(status).toBe(400)
  expect(typeof body).toBe('object')
  expect(body.param).toBe('username')
})
test('POST /auth 400 - invalid password', async () => {
  const { status, body } = await request(app)
    .post('/')
    .auth('iamarpit', '123')
    .send({ hardwareID: '123456' })

  expect(status).toBe(400)
  expect(typeof body).toBe('object')
  expect(body.param).toBe('password')
})
test('POST /auth 401 - user does not exist', async () => {
  const { status } = await request(app)
    .post('/')
    .auth('iampolite', 'password')
    .send({ hardwareID: '123456' })

  expect(status).toBe(401)
})
test('POST /auth 401 - wrong password', async () => {
  const { status } = await request(app)
    .post('/')
    .auth('iamarpit', 'passwor')
    .send({ hardwareID: '123456' })

  expect(status).toBe(401)
})
test('POST /auth 401 - missing hardwareID', async () => {
  const { status, body } = await request(app)
    .post('/')
    .auth('iamarpit', 'password')

  expect(status).toBe(400)
  expect(typeof body).toBe('object')
  expect(body.param).toBe('hardwareID')
})
test('POST /auth 401 - missing auth', async () => {
  const { status } = await request(app)
    .post('/')
    .send({ hardwareID: '123456' })

  expect(status).toBe(401)
})

test('DELETE /auth/token 200', async () => {
  const { status, body } = await request(app)
    .delete('/token')
    .send({ access_token: session })

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.message).toBe('access token has been purged')
})
test('DELETE /auth/token 200 - missing Access Token', async () => {
  const { status, body } = await request(app)
    .delete('/token')

  expect(status).toBe(403)
  expect(typeof body).toBe('object')
  expect(body.message).toBe('Access Denied')
})
