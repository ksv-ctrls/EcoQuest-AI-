import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { createHttpError } from '../utils/http-error.js'
import { UserModel, type UserDocument } from '../models/User.js'
import type { JwtPayload } from '../types/auth.js'

const SALT_ROUNDS = 12
const TOKEN_EXPIRES_IN = '7d'

export interface RegisterInput {
  name: string
  email: string
  password: string
  profile?: unknown
}

export interface LoginInput {
  email: string
  password: string
}

function signToken(user: UserDocument) {
  const payload: JwtPayload = { userId: user.id }
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRES_IN })
}

export function toAuthResponse(user: UserDocument) {
  return {
    token: signToken(user),
    user: user.toJSON(),
  }
}

export async function registerUser(input: RegisterInput) {
  const existing = await UserModel.findOne({ email: input.email.toLowerCase() })
  if (existing) {
    throw createHttpError(409, 'An account with this email already exists.')
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)
  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    profile: input.profile ?? {},
  })

  return toAuthResponse(user)
}

export async function loginUser(input: LoginInput) {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select('+password')
  if (!user) {
    throw createHttpError(401, 'Invalid email or password.')
  }

  const isValid = await bcrypt.compare(input.password, user.password)
  if (!isValid) {
    throw createHttpError(401, 'Invalid email or password.')
  }

  return toAuthResponse(user)
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}
