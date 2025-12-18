import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import transcriptRoutes from './routes/transcripts.js'
import searchRoutes from './routes/search.js'
import { errorHandler } from './middleware/errorHandler.js'
import './config/database.js' // Initialize database connection

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'], // Vite dev server (multiple ports)
    credentials: true,
  })
)
app.use(express.json({ limit: '50mb' })) // For base64 video uploads
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Transcript Parser API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth (POST /register, POST /login, GET /me)',
      transcripts: '/api/transcripts (GET, POST, GET /:id, DELETE /:id)',
      search: '/api/search?q=query',
    },
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/transcripts', transcriptRoutes)
app.use('/api/search', searchRoutes)

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
