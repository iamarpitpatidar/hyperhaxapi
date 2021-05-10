import { User } from './index'
import { Subscription } from '../subscription'

let user

beforeEach(async () => {
  const subscription = await Subscription.create({ code: 'c106a26a-21bb-5538-8bf2-57095d1976c1' })
  user = await User.create({
    username: 'iamarpit',
    password: '123456',
    invitedBy: subscription.createdBy,
    subscription: {
      plan: subscription.plan,
      expiry: subscription.expiry
    }
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = user.view()
    expect(view).toBeDefined()
    expect(view._id).toBe(user._id)
    expect(view.username).toBe(user.username)
    expect(view.status).toBe(user.status)
  })

  it('returns full view', () => {
    const view = user.view(true)
    expect(view).toBeDefined()
    expect(view._id).toBe(user._id)
    expect(view.username).toBe(user.username)
    expect(view.status).toBe(user.status)
    expect(view.invitedBy).toBe(user.invitedBy)
    expect(view.role).toBe(user.role)
    expect(view.createdAt).toEqual(user.createdAt)
    expect(view.subscription).toBe(user.subscription)
  })
})

describe('authenticate', () => {
  it('returns the user when authentication succeed', async () => {
    expect(await user.authenticate('123456')).toBe(user)
  })

  it('returns false when authentication fails', async () => {
    expect(await user.authenticate('blah')).toBe(false)
  })
})
