import request from 'supertest'
import express from 'express'
import routes from './index'
import server from '../../services/express'
import { User } from '../user'
import { verify, signSync } from '../../services/jwt'

const app = server(express(), routes)
let user, user2, bannedUser
const session = {}

beforeEach(async () => {
  user = await User.create({ username: 'iamarpit', password: 'password', hardwareID: '123456' })
  user2 = await User.create({ username: 'user2', password: 'password', hardwareID: '1234567' })
  bannedUser = await User.create({ username: 'banned', password: 'password', status: 'banned' })
  session.user = signSync({
    id: user.id,
    secret: user.secret,
    expiry: Date.now() + (1000 * 60 * 60)
  })
  session.invalidId = signSync({
    id: 'invalid',
    secret: user.secret,
    expiry: Date.now() + (1000 * 60 * 60)
  })
  session.invalidSecret = signSync({
    id: user.id,
    secret: 'invalid',
    expiry: Date.now() + (1000 * 60 * 60)
  })
  session.expiredToken = signSync({
    id: user.id,
    secret: user.secret,
    expiry: 1
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
  it('should set hardwareId if found null', async () => {
    const hardwareID = '1234567'
    const { status, body } = await request(app)
      .post('/')
      .auth('user2', 'password')
      .send({ hardwareID: hardwareID })

    expect(status).toEqual(201)
    expect(typeof body).toBe('object')
    expect(user2.hardwareID).toEqual(hardwareID)
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
  it('should throw Forbidden - (403, banned User)', async () => {
    const { status, body } = await request(app)
      .post('/')
      .auth('banned', 'password')
      .send({ hardwareID: '123456' })

    expect(status).toEqual(403)
    expect(typeof body).toEqual('object')
    expect(body.message).toEqual('User is banned')
  })
})

describe('purge Access Token', () => {
  it('should purge Access Token - (200)', async () => {
    const { status, body } = await request(app)
      .delete('/token')
      .send({ access_token: session.user })

    expect(status).toBe(200)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('access token has been purged')
  })
  it('should throw UnAuthorized - (401, invalid ID Token)', async () => {
    const { status, body } = await request(app)
      .delete('/token')
      .send({ access_token: session.invalidId })

    expect(status).toBe(401)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Token is invalid')
  })
  it('should throw UnAuthorized - (401, invalid secret Token)', async () => {
    const { status, body } = await request(app)
      .delete('/token')
      .send({ access_token: session.invalidSecret })

    expect(status).toBe(401)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Token is invalid')
  })
  it('should throw UnAuthorized - (401, expired Token)', async () => {
    const { status, body } = await request(app)
      .delete('/token')
      .send({ access_token: session.expiredToken })

    expect(status).toBe(401)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Token is expired')
  })
  it('should throw Forbidden - (403, invalid Token)', async () => {
    const { status, body } = await request(app)
      .delete('/token')
      .send({ access_token: 'invalid' })

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
  it('should throw Forbidden - (403, missing Access Token)', async () => {
    const { status, body } = await request(app)
      .delete('/token')

    expect(status).toBe(403)
    expect(typeof body).toBe('object')
    expect(body.message).toBe('Access Denied')
  })
})
