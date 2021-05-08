import request from 'supertest'
import express from 'express'
import routes from './index'

const app = express()
app.use('/', routes)

test('GET / 200', async () => {
  const { status, body } = await request(app)
    .get('/')

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body).not.toBe(null)
  expect(body.status).toBe('ok')
})

test('Post / 405', async () => {
  const { status } = await request(app)
    .post('/')

  expect(status).toBe(405)
})
