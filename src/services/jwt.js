import jwt from 'jsonwebtoken'
import Promise from 'bluebird'
import { jwtSecret } from '../config'

const jwtSign = Promise.promisify(jwt.sign)
const jwtVerify = Promise.promisify(jwt.verify)

export const sign = (payload, options, method = jwtSign) =>
  method(payload, jwtSecret, options)

export const verify = (token) => jwtVerify(token, jwtSecret)
