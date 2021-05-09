export const success = (res, response) => {
  res.status(200)
    .json(response)
    .end()
}

export const error = (res, response) => {
  res.status(response.statusCode)
    .json({
      message: response.message,
      requestId: Math.random().toString(32).substring(2)
    }).end()
}
