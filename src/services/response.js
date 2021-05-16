export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity)
  }
  return null
}

export const error = (res, message, status) => {
  if (message) {
    res.status(status || 400).json({
      message: message,
      requestId: Math.random().toString(32).substring(2)
    })
  }
  res.status(404).end()
  return null
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).end()
  return null
}
