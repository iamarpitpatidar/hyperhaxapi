import request from 'supertest'
import express from 'express'
import routes, { Product } from './index'
import server from '../../services/express'

const app = server(express(), routes)
const products = []

beforeEach(async () => {
  for (let num = 1; num < 10; num++) {
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
})

test('should return Array of all products - (200, no Auth)', async () => {
  const { status, body } = await request(app)
    .get('/')

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.rows.length).toBe(9)
})
