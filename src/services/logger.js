import { createLogger, format, transports } from 'winston'
import { logs } from '../config'
const { combine, timestamp, printf } = format

const loggerInstance = createLogger({
  level: logs.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat()
  ),
  transports: [
    new transports.File({
      filename: './logs/combined.log',
      format: combine(printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`))
    }),
    new transports.Console({
      format: combine(
        format.colorize(),
        printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`))
    })
  ]
})

module.exports = loggerInstance
