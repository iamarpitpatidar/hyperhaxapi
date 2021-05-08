import express from './express'
import mongoose from './mongoose'
import logger from './logger'
import { mongo } from '../config'

export default async function (app, routes) {
  await mongoose.connect(mongo.uri)
  logger.info('Database Service started!')

  await express(app, routes)
  logger.info('Express Loaded!')
}
