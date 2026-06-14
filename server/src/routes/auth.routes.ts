import { Router } from 'express'
import { login, me, register, updateProfile } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/me', authMiddleware, me)
authRouter.put('/profile', authMiddleware, updateProfile)

