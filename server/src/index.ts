import express from 'express'
import cors from 'cors'
import path from 'path'
import { env } from './config/env'
import authRoutes from './routes/auth'
import transcriptRoutes from './routes/transcripts'

const app = express()

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/transcripts', transcriptRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 100MB.' })
    }
    return res.status(400).json({ error: err.message })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const PORT = parseInt(env.PORT)

app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
📝 Environment: ${env.NODE_ENV}
🔗 API: http://localhost:${PORT}/api
💾 Database: ${env.DATABASE_URL ? 'Connected' : 'Not configured'}
🤖 Gemini: ${env.GEMINI_API_KEY ? 'Configured' : 'Not configured'}
  `)
})

export default app
