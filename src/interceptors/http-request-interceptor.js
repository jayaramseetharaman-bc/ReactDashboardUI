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

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    throw error
  },
)

export default httpClient
