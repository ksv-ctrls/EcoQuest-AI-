import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function getPasswordStrength(password: string): { score: number; message: string } {
  if (password.length < 8) {
    return { score: 0, message: 'Password must be at least 8 characters' }
  }
  if (!/[A-Z]/.test(password)) {
    return { score: 1, message: 'Add uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { score: 1, message: 'Add lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { score: 2, message: 'Add number' }
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { score: 3, message: 'Add special character' }
  }
  return { score: 4, message: 'Strong password' }
}

export function RegisterPage() {
  const { isAuthenticated, isLoading, register, error } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const passwordStrength = getPasswordStrength(password)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    
    if (passwordStrength.score < 3) {
      return
    }
    
    setEmailError('')
    try {
      await register({ name, email, password })
      navigate('/onboarding', { replace: true })
    } catch (err) {
      // Error is handled by AuthContext
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-dark p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your EcoQuest account</CardTitle>
          <CardDescription>Register now and keep local progress fallback enabled.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block text-sm font-medium text-primary-dark">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              className="mt-2 h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-green"
            />
          </label>
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
                minLength={8}
                required
                autoComplete="new-password"
                aria-describedby={password ? 'password-strength' : undefined}
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
            {password && (
              <p id="password-strength" className={`mt-1 text-sm ${passwordStrength.score >= 3 ? 'text-green-700' : 'text-orange-700'}`}>
                {passwordStrength.message}
              </p>
            )}
          </label>
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-sage">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary-green">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  )
}
