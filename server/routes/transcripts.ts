import { Router } from 'express'
import {
  createTranscript,
  getTranscripts,
  getTranscript,
  deleteTranscript,
} from '../controllers/transcriptController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.post('/', createTranscript)
router.get('/', getTranscripts)
router.get('/:id', getTranscript)
router.delete('/:id', deleteTranscript)

export default router
