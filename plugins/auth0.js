import Auth0Lock from 'auth0-lock'
import queryString from 'query-string'
import jwtDecode from 'jwt-decode'

const config = {
  clientId: process.env.AUTH0_CLIENT_ID,
  domain: process.env.AUTH0_DOMAIN 
}

const auth0Util = {
  get baseUrl() {
    return `${window.location.protocol}//${window.location.host}`
  },

  get queryParams() {
    return queryString.parse(location.hash)
  },

  get isAuthenticated() {
    const expiresAt = window.localStorage.getItem('expiresAt')
    return Date.now() < expiresAt
  },

  setToken({ access_token, id_token, expires_in }) {
    const storage = window.localStorage
    storage.setItem('acessToken', access_token)
    storage.setItem('idToken', id_token)
    storage.setItem('expiresAt', expires_in * 1000 + Date.now())
    storage.setItem('user', JSON.stringify(jwtDecode(id_token)))
  },

  unsetToken() {
    const storage = window.localStorage
    storage.removeItem('acessToken')
    storage.removeItem('idToken')
    storage.removeItem('expiresAt')
    storage.removeItem('user')
  },

  setTokenByQuery() {
    auth0Util.setToken(auth0Util.queryParams)
  },

  showLock(container) {
    const lock = new Auth0Lock(config.clientId, config.domain, {
      container,
      auth: {
        responseType: 'token id_token',
        redirectUrl: `${auth0Util.baseUrl}/callback`,
        params: { scope: 'openid profile email' },
      }
    })

    lock.show()
  }
}

// class Auth0Util {
//   static getBaseUrl() {
//     return `${window.location.protocol}//${window.location.host}`
//   }

//   static getQueryParams() {
//     return queryString.parse(location.hash)
//   }

//   static setToken({ accsess_token, id_token, expires_in }) {
//     const storage = window.localStorage
//     storage.setItem('acessToken', accsess_token)
//     storage.setItem('idToken', id_token)
//     storage.setItem('expiresAt', expires_in * 1000 + new Date().getTime())
//     storage.setItem('user', JSON.stringify(jwtDecode(id_token)))
//   }

//   setTokenByQuery() {
//     Auth0Util.setToken(Auth0Util.getQueryParams())
//   }

//   showLock(container) {
//     const lock = new Auth0Lock(config.clientId, config.domain, {
//       container,
//       auth: {
//         responseType: 'token id_token',
//         redirectUrl: `${Auth0Util.getBaseUrl()}/callback`,
//         params: { scope: 'openid profile email' },
//       }
//     })

//     lock.show()
//   }
// }

export default (context, inject) => {
  inject('auth0', auth0Util)
}
