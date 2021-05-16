import { v5 as uuid } from 'uuid'
import { Invite } from './index'
import { baseNamespace } from '../../config'

export const index = (req, res, next) => {
  Invite.create({
    code: uuid(Math.random().toString(32).substring(2), baseNamespace),
    role: 'rust'
  })
  res.send('This route will index all the inviteCodes')
}

export const create = (req, res, next) => {
  res.send('This route will create a inviteCode, and return the object')
}
