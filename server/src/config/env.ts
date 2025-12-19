import dotenv from 'dotenv'

dotenv.config()

export const env = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '104857600'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
}

// Validate required environment variables
const required = ['DATABASE_URL', 'JWT_SECRET', 'GEMINI_API_KEY']
const missing = required.filter(key => !env[key as keyof typeof env])

if (missing.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`)
}
