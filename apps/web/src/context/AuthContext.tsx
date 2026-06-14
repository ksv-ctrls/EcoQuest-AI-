import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as loginApi, register as registerApi, getMe, type ApiUser, type LoginPayload, type RegisterPayload } from '@/api/authApi'
import { getStoredAuthToken, setStoredAuthToken, clearStoredAuthToken } from '@/api/apiClient'

interface AuthContextType {
  user: ApiUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getStoredAuthToken()
    if (token) {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  async function fetchUser() {
    try {
      const userData = await getMe()
      setUser(userData)
    } catch (err) {
      console.error('Failed to fetch user:', err)
      clearStoredAuthToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(payload: LoginPayload) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await loginApi(payload)
      setStoredAuthToken(response.token)
      setUser(response.user)
    } catch (err: any) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function register(payload: RegisterPayload) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await registerApi(payload)
      setStoredAuthToken(response.token)
      setUser(response.user)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    clearStoredAuthToken()
    setUser(null)
  }

  function clearError() {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
