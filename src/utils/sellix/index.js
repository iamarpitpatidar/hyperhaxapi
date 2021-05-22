import axios from 'axios'
import { sellixApiKey } from '../../config'
import logger from '../../services/logger'

class Client {
  constructor (apiKey) {
    this.apiKey = apiKey
    this.headers = { Authorization: `Bearer ${this.apiKey}` }

    /**
     * Validating API Key
     */
    axios.get('https://dev.sellix.io/v1/products', {
      headers: this.headers
    }).then(response => response.data)
      .then(response => {
        if (response.status === 401) return logger.error('Invalid API Key')
      })
  }

  getAllProducts () {
    return this.get('products', 'get', body => body.data.products)
  }

  get (route, type, callback) {
    return new Promise((resolve, reject) => {
      axios[type](`https://dev.sellix.io/v1/${route}`, {
        headers: this.headers
      }).then(response => response.data)
        .then(data => resolve(callback(data)))
        .catch(error => reject(error))
    })
  }
}

const sellix = new Client(sellixApiKey)
export default sellix
