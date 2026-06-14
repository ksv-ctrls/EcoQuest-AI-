import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const TOKEN_STORAGE_KEY = 'ecoquest-auth-token'

export interface ApiErrorPayload {
  message: string
  status?: number
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 8000,
})

export function getStoredAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredAuthToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      clearStoredAuthToken()
      window.location.href = '/login'
    }
    
    const payload: ApiErrorPayload = {
      message:
        error.response?.data?.message ??
        error.message ??
        'Unable to reach EcoQuest API.',
      status: error.response?.status,
    }
    return Promise.reject(payload)
  },
)

export { TOKEN_STORAGE_KEY }
