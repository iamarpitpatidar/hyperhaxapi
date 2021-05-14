import request from 'supertest'
import express from 'express'
import routes from './index'

const app = express()
app.use('/', routes)

test('GET / 200', async () => {
  const { status, body } = await request(app)
    .get('/')

  expect(status).toBe(200)
  expect(body.status).toBe('ok')
})
