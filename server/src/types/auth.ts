import type { Types } from 'mongoose'

export interface JwtPayload {
  userId: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  mongoId: Types.ObjectId
}
