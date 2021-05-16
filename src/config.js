import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 9000,
    defaultEmail: 'no-reply@hyperhax.com',
    adminEmail: 'admin@hyperhax.com',
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    mongo: {
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      }
    },
    logs: {
      level: 'silly'
    }
  },
  test: {},
  development: {
    mongo: {
      uri: 'mongodb://localhost/hyperhaxapi-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    port: process.env.PORT || 3030,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/hyperhaxapi'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
