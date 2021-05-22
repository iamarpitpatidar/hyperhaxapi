import path from 'path'
import merge from 'lodash/merge'

const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    defaultEmail: 'no-reply@hyperhaxapi.com',
    adminEmail: 'admin@hyperhax.com',
    sellixApiKey: requireProcessEnv('SELLIX_API_KEY'),
    baseNamespace: requireProcessEnv('BASE_NAMESPACE'),
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
    mongo: {
      uri: process.env.MONGODB_URI
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
