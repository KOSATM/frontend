import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080',
  timeout: 10000
})

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default instance
