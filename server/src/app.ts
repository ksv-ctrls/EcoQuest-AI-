import cors from 'cors'
import express from 'express'
import { apiRouter } from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.use('/api', apiRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

export const app = createApp()
