import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function LoginPage() {
  const { isAuthenticated, isLoading, login, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    
    setEmailError('')
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      // Error is handled by AuthContext
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-dark p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in to EcoQuest</CardTitle>
          <CardDescription>Use your backend account to sync progress across devices.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block text-sm font-medium text-primary-dark">
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setEmailError('')
              }}
              type="email"
              required
              autoComplete="email"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              className="mt-2 h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-green"
            />
            {emailError && <p id="email-error" className="mt-1 text-sm text-red-700" role="alert">{emailError}</p>}
          </label>
          <label className="block text-sm font-medium text-primary-dark">
            <span>Password</span>
            <div className="relative mt-2">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="h-11 w-full rounded-lg border border-border px-3 pr-10 text-sm outline-none focus:border-primary-green"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sage hover:text-primary-dark"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </label>
          <label className="flex items-center gap-2 text-sm text-primary-dark">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-border text-primary-green focus:ring-primary-green"
            />
            <span>Remember me</span>
          </label>
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-sage">
          New to EcoQuest?{' '}
          <Link to="/register" className="font-semibold text-primary-green">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  )
}
