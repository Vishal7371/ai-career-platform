import axios from 'axios'

// Point to your FastAPI backend
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' }
})

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth functions
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser   = (data) => API.post('/auth/login', data)

export default API
