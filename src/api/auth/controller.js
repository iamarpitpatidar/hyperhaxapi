export const login = (req, res, next) => {
  res.send('This route will login user without session and send access token')
}

export const logout = (req, res, next) => {
  res.send('This route will logout and purge the access token')
}
