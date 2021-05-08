import request from 'supertest'
import express from 'express'
import server from '../../services/express'
import routes from './index'

const app = server(express())

test('GET / 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})
