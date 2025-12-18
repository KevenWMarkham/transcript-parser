import { Router } from 'express'
import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database.js'
import { transcripts } from '../db/schema.js'
import { eq, and, ilike } from 'drizzle-orm'
import { authenticate } from '../middleware/authMiddleware.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId
      if (!userId) throw new AppError(401, 'Not authenticated')

      const { q } = req.query

      if (!q || typeof q !== 'string') {
        throw new AppError(400, 'Search query required')
      }

      const results = await db.query.transcripts.findMany({
        where: and(
          eq(transcripts.userId, userId),
          ilike(transcripts.title, `%${q}%`)
        ),
        with: {
          speakers: true,
        },
      })

      res.json({
        status: 'success',
        data: { results },
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router
