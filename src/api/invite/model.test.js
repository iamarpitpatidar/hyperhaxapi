import { v5 as uuid } from 'uuid'
import { baseNamespace } from '../../config'
import { Invite } from '.'

let invite

beforeEach(async () => {
  invite = await Invite.create({
    code: uuid(Math.random().toString(32).substring(2), baseNamespace),
    role: 'rust',
    length: 1,
    orderID: 'ID12345'
  })
})

describe('Invite view', () => {
  it('returns simple view', () => {
    const view = invite.view()

    expect(view).toBeDefined()
    expect(view._id).toEqual(invite._id)
    expect(view.role).toEqual('rust')
    expect(view.length).toEqual(1)
    expect(view.orderID).toEqual('ID12345')
    expect(view.createdBy).toEqual('admin')
  })

  it('returns full view', () => {
    const view = invite.view(true)

    expect(view).toBeDefined()
    expect(view._id).toEqual(invite._id)
    expect(view.role).toEqual('rust')
    expect(view.code).toEqual(invite.code)
    expect(view.used).toEqual(invite.used)
    expect(view.length).toEqual(1)
    expect(view.soldTo).toEqual(invite.soldTo)
    expect(view.orderID).toEqual('ID12345')
    expect(view.createdBy).toEqual('admin')
  })
})
