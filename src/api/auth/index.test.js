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

describe('Get Access Token', () => {
  it('should return Access Token - (201, user)', async () => {
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
  it('should throw Bad Request - invalid username (400, user)', async () => {
    const { status, body } = await request(app)
      .post('/')
      .auth('i', 'password')
      .send({ hardwareID: '123456' })

    expect(status).toBe(400)
    expect(typeof body).toBe('object')
    expect(body.param).toBe('username')
  })
  it('should throw Bad Request - invalid password (400, user)', async () => {
    const { status, body } = await request(app)
      .post('/')
      .auth('iamarpit', '123')
      .send({ hardwareID: '123456' })

    expect(status).toBe(400)
    expect(typeof body).toBe('object')
    expect(body.param).toBe('password')
  })
  it('should throw Bad Request - missing hardware (400, user)', async () => {
    const { status, body } = await request(app)
      .post('/')
      .auth('iamarpit', 'password')

    expect(status).toBe(400)
    expect(typeof body).toBe('object')
    expect(body.param).toBe('hardwareID')
  })
  it('should throw UnAuthorized - hardwareID mismatch (401, user)', async () => {
    const { status, body } = await request(app)
      .post('/')
      .auth('iamarpit', 'password')
      .send({ hardwareID: 'invalid' })

    expect(status).toBe(401)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Your hardwareID does not match the one in server')
  })
  it('should throw UnAuthorized - wrong password (401, user)', async () => {
    const { status } = await request(app)
      .post('/')
      .auth('iamarpit', 'passwor')
      .send({ hardwareID: '123456' })

    expect(status).toBe(401)
  })
  it('should throw UnAuthorized - user does not exist (401, user)', async () => {
    const { status } = await request(app)
      .post('/')
      .auth('iampolite', 'password')
      .send({ hardwareID: '123456' })

    expect(status).toBe(401)
  })
  it('should throw UnAuthorized - (401, no Auth)', async () => {
    const { status } = await request(app)
      .post('/')
      .send({ hardwareID: '123456' })

    expect(status).toBe(401)
  })
})

describe('purge Access Token', () => {
  it('should purge Access Token - (200)', async () => {
    const { status, body } = await request(app)
      .delete('/token')
      .send({ access_token: session })

    expect(status).toBe(200)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('access token has been purged')
  })
  it('should throw Forbidden - missing Access Token (403)', async () => {
    const { status, body } = await request(app)
      .delete('/token')

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
})
