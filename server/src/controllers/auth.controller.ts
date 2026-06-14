import { loginUser, registerUser } from '../services/auth.service.js'
import { asyncHandler } from '../utils/async-handler.js'
import { createHttpError } from '../utils/http-error.js'
import { UserModel } from '../models/User.js'

function assertString(value: unknown, field: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw createHttpError(400, `${field} is required.`)
  }
  return value.trim()
}

export const register = asyncHandler(async (req, res) => {
  const name = assertString(req.body.name, 'name')
  const email = assertString(req.body.email, 'email')
  const password = assertString(req.body.password, 'password')

  if (password.length < 8) {
    throw createHttpError(400, 'password must be at least 8 characters.')
  }

  const result = await registerUser({
    name,
    email,
    password,
    profile: req.body.profile,
  })

  res.status(201).json(result)
})

export const login = asyncHandler(async (req, res) => {
  const email = assertString(req.body.email, 'email')
  const password = assertString(req.body.password, 'password')
  const result = await loginUser({ email, password })

  res.json(result)
})

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Authentication is required.')
  }

  const user = await UserModel.findById(req.user.id)
  if (!user) {
    throw createHttpError(404, 'User not found.')
  }

  res.json({ user: user.toJSON() })
})

export const updateProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Authentication is required.')
  }

  const user = await UserModel.findById(req.user.id)
  if (!user) {
    throw createHttpError(404, 'User not found.')
  }

  user.profile = {
    ...((user.profile as any)?.toJSON?.() ?? user.profile ?? {}),
    ...req.body,
  }

  await user.save()
  res.json({ user: user.toJSON() })
})

