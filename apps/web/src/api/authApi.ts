import { apiClient } from '@/api/apiClient'

export interface ApiUser {
  id: string
  name: string
  email: string
  profile?: unknown
  level: number
  xp: number
  ecoCoins: number
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: ApiUser
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  profile?: unknown
}

export interface LoginPayload {
  email: string
  password: string
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload)
  return response.data
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload)
  return response.data
}

export async function getMe() {
  const response = await apiClient.get<{ user: ApiUser }>('/auth/me')
  return response.data.user
}
