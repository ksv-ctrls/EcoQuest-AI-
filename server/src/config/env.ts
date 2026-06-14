import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_PORT = 5000

function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  mongoUri: required('MONGO_URI', 'mongodb://127.0.0.1:27017/ecoquest'),
  jwtSecret: required('JWT_SECRET', 'replace-this-secret-in-production'),
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
