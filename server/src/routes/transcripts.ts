import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import * as transcriptionController from '../controllers/transcriptionController'
import { authenticateToken } from '../middleware/auth'

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv']
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'))
    }
  }
})

const router = Router()

// All routes require authentication
router.use(authenticateToken)

router.post('/upload', upload.single('video'), transcriptionController.uploadAndTranscribe)
router.get('/', transcriptionController.listTranscripts)
router.get('/:id', transcriptionController.getTranscript)
router.delete('/:id', transcriptionController.deleteTranscript)
router.patch('/:id/entry/:entryId', transcriptionController.updateEntry)

export default router
