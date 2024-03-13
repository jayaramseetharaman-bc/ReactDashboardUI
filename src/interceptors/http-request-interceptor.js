import axios from 'axios'
function getAuthToken() {
  return localStorage.getItem('accessToken')
}
// Creating an Axios instance with default configuration
const httpClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300
  },
})

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${getAuthToken()}`
    return config
  },
  (error) => {
    throw error
  },
)

export function handleRedirectToErrorPage(path) {
  window.location.href = `/#${path}`
}

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        handleRedirectToErrorPage('/error')
      } else if (status === 404) {
        handleRedirectToErrorPage('/404')
      } else if (status === 500) {
        handleRedirectToErrorPage('/500')
      }
    }
    throw error
  },
)

export default httpClient
