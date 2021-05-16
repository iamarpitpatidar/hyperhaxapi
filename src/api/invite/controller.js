export const index = (req, res, next) => {
  res.send('This route will index all the inviteCodes')
}

export const create = (req, res, next) => {
  res.send('This route will create a inviteCode, and return the object')
}
