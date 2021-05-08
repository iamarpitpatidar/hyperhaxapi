import express from './express'
import mongoose from './mongoose'
import logger from './logger'
import { mongo } from '../config'

export default async function (app) {
  await mongoose.connect(mongo.uri)
  logger.info('Database Service started!')

  await express(app)
  logger.info('Express Loaded!')
}
